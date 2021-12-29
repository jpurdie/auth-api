/* eslint-disable @typescript-eslint/no-var-requires */
import addFormats from 'ajv-formats';
import db from '../../models';
import { deleteUser, createUser } from '../../utilities/awscognito';

const Ajv = require('ajv');

const reqSchema = require('./post_schema.json');

const Organization = db.organizations;
const Profile = db.profiles;
const User = db.users;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const response = {
  statusCode: 200,
  body: JSON.stringify({}),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export default async function (event) {
  console.log('Inside users/post.js');
  const requestBody = JSON.parse(event.body);
  console.log('requestBody', requestBody);

  /*
    Validating request
  */
  try {
    const validate = ajv.compile(reqSchema);
    const valid = validate(requestBody);
    if (!valid) {
      response.body = JSON.stringify(validate.errors);
      response.statusCode = 422;
      return response;
    }
  } catch (error) {
    console.error('User Validation', error);
    response.body = JSON.stringify({
      errors: [{ msg: 'An unknown error has occurred.' }],
    });
    response.statusCode = 500;
    throw error;
  }

  /*
    End validation
    Begin Authentication Service Creation
  */

  const userToCreate = {
    email: requestBody.email,
    user_metadata: {},
    email_verified: false,
    given_name: requestBody.givenName,
    family_name: requestBody.familyName,
    name: `${requestBody.givenName} ${requestBody.familyName}`,
    nickname: requestBody.givenName,
    connection: process.env.AUTH0_CONNECTION,
    password: requestBody.password,
    verify_email: true,
  };

  let identityUser;

  try {
    identityUser = await createUser(userToCreate);
    console.log(`Response From createUser`, identityUser);
  } catch (error) {
    switch (String(error)) {
      case 'Error: UsernameExistsException':
        response.body = JSON.stringify({
          errors: [{ msg: 'User already exists.' }],
        });
        response.statusCode = 409;
        return response;
      default:
        response.body = JSON.stringify({
          errors: [{ msg: 'An unknown error has occurred.' }],
        });
        response.statusCode = 500;
        return response;
    }
  }

  /*
    End Authentication Service Creation
  */

  /*
     Begin data store creation
  */

  try {
    if (identityUser !== undefined && identityUser.User !== null) {
      userToCreate.sub = identityUser.User.Username;
      userToCreate.organizationName = requestBody.organizationName;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const isSuccess = await createUserInStore(userToCreate);
      if (!isSuccess) {
        await deleteUser(userToCreate.email);
      }
    }
  } catch (error) {
    /*
      Error with request. Log and then handle error.
    */
    console.error('error.response', error);
    deleteUser(userToCreate.email);

    response.body = JSON.stringify({
      errors: [{ msg: 'An unknown error has occurred.' }],
    });
    response.statusCode = 400;
    return response;
  }
  response.statusCode = 201;
  return response;
}

async function createUserInStore(userToStore) {
  console.debug('Checking if user exists.', userToStore.email);
  const userFromStore = await User.findOne({
    where: { email: userToStore.email },
  });

  if (userFromStore === null) {
    console.debug("User doesn't exist.");
    console.debug('Creating User.', userToStore);

    const t = await db.sequelize.transaction();

    try {
      const myUser = await User.create(
        {
          externalSub: userToStore.sub,
          email: userToStore.email,
          givenName: userToStore.given_name,
          familyName: userToStore.family_name,
        },
        { transaction: t }
      );
      const myOrg = await Organization.create(
        {
          name: userToStore.organizationName,
        },
        { transaction: t }
      );

      await Profile.create(
        {
          organizationId: myOrg.id,
          userId: myUser.id,
          roleId: 500,
        },
        { transaction: t }
      );
      await t.commit();
    } catch (error) {
      console.error(error);
      await t.rollback();
      return false;
    }
    console.log('User created');
  } else {
    console.log('User exists.');
  }
  return true;
}
