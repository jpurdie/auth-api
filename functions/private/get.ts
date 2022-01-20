export default async function (event) {
  console.log('Inside Private.js handler');
  console.log('event', event.requestContext.authorizer.jwt);
  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: `Hello from Private GET`,
    }),
  };
}
