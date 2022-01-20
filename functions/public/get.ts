export default async function (event) {
  let idReq = '';
  if (event.pathParameters !== null && event.pathParameters.idreq !== null) {
    idReq = event.pathParameters.idreq;
  }

  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(`Hello from Public GET`),
  };
}
