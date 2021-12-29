const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider();
// const crypto = require('crypto');

AWS.config.update({
  region: process.env.COGNITO_REGION,
});

// function secretHash(userName) {
//   // Base64 ( HMAC_SHA256 ( "Client Secret Key", "Username" + "Client Id" ) )
//   const secretKey = process.env.COGNITO_CLIENT_SECRET;

//   const test = crypto
//     .createHmac('sha256', secretKey)
//     .update(userName + process.env.COGNITO_CLIENT_ID)
//     .digest('base64');
//   return test;
// }

async function adminResetUserPassword(userName) {
  console.log('Inside adminResetUserPassword()');

  const params = {
    Username: userName,
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
  };
  console.log('Sending to AWS', params);

  try {
    const result = await cognito.adminResetUserPassword(params);
    console.log('Result from admin change password user', result.response);
    return result.response;
  } catch (error) {
    console.error('Error in createUser()', error);
    throw new Error(error.code);
  }
}

async function changePassword(newPassword, userName) {
  console.log('Inside changePassword()');

  const params = {
    Password: newPassword,
    Permanent: true,
    Username: userName,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  };
  console.log('Sending to AWS', params);

  try {
    const result = await cognito.adminSetUserPassword(params);
    console.log('Result from admin change password user', result.response);
    return result.response;
  } catch (error) {
    console.error('Error in createUser()', error);
    throw new Error(error.code);
  }
}

async function createUser(userToCreate) {
  console.log('Inside createUser()', userToCreate);
  const params = {
    // ClientId: process.env.COGNITO_CLIENT_ID,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userToCreate.email,
    DesiredDeliveryMediums: ['EMAIL'],
    // SecretHash: secretHash(userToCreate.email),
    UserAttributes: [
      {
        Name: 'name',
        Value: userToCreate.name,
      },
      {
        Name: 'email',
        Value: userToCreate.email,
      },
      {
        Name: 'given_name',
        Value: userToCreate.given_name,
      },
      {
        Name: 'family_name',
        Value: userToCreate.family_name,
      },
      {
        Name: 'nickname',
        Value: userToCreate.name,
      },
    ],
  };
  console.log('Sending to AWS', params);
  try {
    const result = await cognito.adminCreateUser(params).promise();
    console.log('Result from admin create user', result);
    return result;
  } catch (error) {
    console.error('Error in createUser()', error);
    throw new Error(error.code);
  }
}

async function deleteUser(email) {
  console.log('Inside deleteUser', email);
  const params = {
    Username: email,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  };

  const result = await cognito.adminDeleteUser(params).promise();
  console.log(JSON.stringify(result, undefined, 2));
  return result;
}

export { deleteUser, createUser, changePassword, adminResetUserPassword };
