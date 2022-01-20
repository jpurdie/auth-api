function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getRandomInt(min, max) {
  const min2 = Math.ceil(min);
  const max2 = Math.floor(max);
  return Math.floor(Math.random() * (max2 - min2) + min2); // The maximum is exclusive and the minimum is inclusive
}

export default async function (event) {
  const idReq = event.pathParameters.idreq;
  const timeToSleep = getRandomInt(1000, 30000);
  console.log(`Inside lambda. Going to sleep for ${timeToSleep}`, idReq);
  await sleep(timeToSleep);
  console.log('Awake. Returning ', idReq);
  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(`Hello from Public POST`),
  };
}
