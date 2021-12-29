import db from '../../models';

const User = db.users;

const response = {
  statusCode: 200,
  body: {},
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

export default async function (event) {
  console.log('Inside users/index.js handler', event.pathParameters);
  const externalSub = event.pathParameters.sub;

  try {
    const userFromStore = await User.findOne({
      where: {
        externalSub,
      },
    });

    response.body = JSON.stringify({ data: userFromStore });
  } catch (error) {
    console.error(`user: error occurred: ${JSON.stringify(error)}`);
    response.body = JSON.stringify({ error });
    response.statusCode = 500;
    throw error;
  }
  console.log('Response:\n', response);
  return response;
}
