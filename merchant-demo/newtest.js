const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require("path");
const getUUID = require('uuid').v4

const agent = new https.Agent({
    cert: path.resolve(__dirname, './ssl/new_test_certificates/Swish_Merchant_TestCertificate_1234679304.pem'),
	key: path.resolve(__dirname, './ssl/new_test_certificates/Swish_Merchant_TestCertificate_1234679304.key'),
	ca: path.resolve(__dirname, './ssl/new_test_certificates/Swish_TLS_RootCA.pem'),
});

// Using Axios as HTTP library
const client = axios.create({
  httpsAgent: agent
});


async function createPaymentRequest(amount, message) {
    const instructionUUID = getUUID();
  
    const data = {
      payeeAlias: '1231111111',
      currency: 'SEK',
      callbackUrl: null,
      amount,
      message,
    };
  
    try {
      const response = await client.put(
        `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${instructionUUID}`,
        data
      );
  
      if (response.status === 201) {
        const { paymentrequesttoken } = response.headers;
        return { id: instructionUUID, token: paymentrequesttoken };
      }
    } catch (error) {
      console.error(error);
    }
  }


  async function hello() {

      const paymentRequest = await createPaymentRequest(100, 'Test Payment');
      
      const callbackUrl = `https://myfrontend.com/receipt?ref=${paymentRequest.id}`;
      const appUrl = `swish://paymentrequest?token=${paymentRequest.token}&callbackurl=${callbackUrl}`;
      
      // Open or redirect the user to the url
      redirect(appUrl);
    }


hello();