import { sequelize, Sequelize } from '../config/db';
import User from '../models/user';

const user = User(sequelize, Sequelize);

export default async function createUser(claims) {
  console.debug('Checking if user exists.');
  let userFromStore = await user.findOne({
    where: { externalSub: claims.sub },
  });

  if (userFromStore === null) {
    console.debug("User doesn't exist.", process.env.AUTH0_EMAIL_CLAIM, claims);
    const auth0EmailClaim = process.env.AUTH0_EMAIL_CLAIM;
    let userEmail = '';
    if (claims[auth0EmailClaim] !== null) {
      userEmail = claims[auth0EmailClaim];
    }
    console.debug('Creating User.', userEmail);
    // creating user if doesn't exist
    userFromStore = await user.create({
      externalSub: claims.sub,
      email: userEmail,
    });
    console.debug('User created', userFromStore);
  } else {
    console.debug('User exists.');
  }
  return userFromStore;
}
