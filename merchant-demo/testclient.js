// E-commerce - the user has to enter their phone number in the checkout. 
// The number is used to create a payment request that can be fetched from 
// the Swish app on the same or a different device.

// M-commerce - from the mobile that has the swish app installed, user does not have to enter phone-n

const fs = require('fs');
const https = require('https');
const axios = require('axios');
const { randomUUID } = require('crypto');

const agent = new https.Agent({
  cert: fs.readFileSync('./ssl/test.pem', { encoding: 'utf8' }),
  key: fs.readFileSync('./ssl/test.key', { encoding: 'utf8' }),
  ca: fs.readFileSync('./ssl/Swish_TLS_RootCA.pem', { encoding: 'utf8' }),
});

// Using Axios as HTTP library
const client = axios.create({
  httpsAgent: agent
});


// TEST request:
// getUUID is a custom function to generate a UUID
// const instructionId = getUUID();

// // Setup the data object for the payment
// const data = {
//   payeePaymentReference: '0123456789',
//   callbackUrl: 'https://example.com/swishcallback',
//   payeeAlias: '1234679304',
//   currency: 'SEK',
//   payerAlias: '4671234768',
//   amount: '100',
//   message: 'Kingston USB Flash Drive 8 GB'
// };

// client.put(
// `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${instructionId}`,
//   data
// ).then((res) => {
//    console.log('Payment request created')
// })




async function createPaymentRequest(amount, message, payerAlias) {
  const instructionUUID = randomUUID();

  const data = {
    payeeAlias: '1231111111',
    currency: 'SEK',
    callbackUrl: 'http://localhost:3000',
    amount,
    message,
    payerAlias
  };

  try {
    const response = await client.put(
      `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${instructionUUID}`,
      data
    );

    if (response.status === 201) {
      console.log("payment request success")
      return { id: instructionUUID };
    }
  } catch (error) {
    console.log("payment request error")
    console.error(error);
  }
}

const paymentRequest = await createPaymentRequest(1, 'Test Payment', '46703214221');

const callbackUrl = `https://myfrontend.com/receipt?ref=${paymentRequest.id}`;
const appUrl = `swish://paymentrequest?token=${paymentRequest.token}&callbackurl=${callback}`;

// Open or redirect the user to the url
redirect(appUrl);