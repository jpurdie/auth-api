const axios = require('axios');
const Redis = require('ioredis');

async function getToken() {
  console.time('redisConn');
  const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_ENDPOINT,
    password: process.env.REDIS_PW,
    username: process.env.REDIS_USER,
  });
  console.timeEnd('redisConn');

  const auth0AccessRedisKey = 'auth0:access_token';
  const token = await redis.get(auth0AccessRedisKey);
  if (token !== null && token !== undefined) {
    return token;
  }
  const newToken = await sendTokenRequest();
  await redis.set(auth0AccessRedisKey, newToken, 'EX', 30);
  redis.disconnect();
  return newToken;
}

async function deleteUser(sub) {
  console.log('deleting user', sub);
  try {
    const token = await getToken();
    const reqURL = `https://${process.env.CLIENT_DOMAIN}/api/v2/users/${sub}`;
    const resp = await axios.delete(reqURL, {
      headers: { authorization: `Bearer ${token}` },
    });
    console.log('Auth0 Response', resp.data);
    return true;
  } catch (error) {
    console.log('Auth0 error', error.data);
  }
  return false;
}

async function sendTokenRequest() {
  console.log('Inside sendTokenRequest()');
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const url = `https://${process.env.CLIENT_DOMAIN}/oauth/token`;
  console.log(`${process.env.AUTH0_MGMT_API_ENDPOINT}/api/v2/`);

  try {
    const resp = await axios.post(url, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: `https://${process.env.CLIENT_DOMAIN}/api/v2/`,
    });
    const data = resp.data.access_token;
    console.log(
      'Returning inside sendTokenRequest(): ',
      data == null || undefined ? 'Does not have token' : 'Has token'
    );
    return data;
  } catch (error) {
    console.error('Error', error);
    return JSON.stringify(error);
  }
}

export { deleteUser, getToken };
