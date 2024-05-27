const express = require('express')
const request = require('request')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors());
app.use(express.json())

// Swish Config - test Certificates
const agent = {	
	payeeAlias: "1231181189",
	host: "https://mss.cpc.getswish.net/swish-cpcapi",
	qrHost: "https://mpc.getswish.net/qrg-swish",
	cert: path.resolve(__dirname, './ssl/Swish_Merchant_TestCertificate_1234679304.pem'),
	key: path.resolve(__dirname, './ssl/Swish_Merchant_TestCertificate_1234679304.key'),
	ca: path.resolve(__dirname, './ssl/Swish_TLS_RootCA.pem'),
	passphrase: "swish"
}


// Create Payment Request
app.post('/paymentrequests',  (req, res) => {
	const data = {
		payeeAlias: '1231111111',
		currency: 'SEK',
		callbackUrl: 'https://webhook.site/a8f9b5c2-f2da-4bb8-8181-fcb84a6659ea',
		amount: req.body.amount,
		message: req.body.message,
		payerAlias: req.body.payerAlias,
	  };

	const options = requestOptions('POST', `${agent.host}/api/v1/paymentrequests`, data)

	request(options, (error, response, body) => { 
		//logResult(error, response)
		if (!response) {
			res.status(500).send(error)
			return
		}
		
		res.status(response.statusCode)
		if (response.statusCode == 201) { 
			const location = response.headers['location']
			const token = response.headers['paymentrequesttoken']

			const opt = requestOptions('GET', location)

			request(opt, (err, resp, bod) => {
				//logResult(err, resp)
				if (!response) {
					res.status(500).send(error)
					return
				}

				const id = resp.body['id']

				res.json({
					url: location,
					token: token,
					id: id
				})
			})

		} else {
			res.send(body)
			return
		} 	
	})
})

// Get Payment Request
app.get('/paymentrequests/:requestId', (req, res) => {
	const options = requestOptions('GET', `${agent.host}/api/v1/paymentrequests/${req.params.requestId}`)

	request(options, (error, response, body) => {

		logResult(error, response)

		if (!response) {
			res.status(500).send(error)
			return
		}

		res.status(response.statusCode)
		if (response.statusCode == 200) {

			res.json({
				id: response.body['id'],
				paymentReference: response.body['paymentReference'] || "",
				status: response.body['status']
			})

		} else { 
			res.send(body)
			return
		}
	})
})

// Create Refund
app.post('/refunds',  (req, res) => {
	const json = {
		payeePaymentReference: "0123456789",
		originalPaymentReference: req.body.originalPaymentReference,
		callbackUrl: "https://webhook.site/a8f9b5c2-f2da-4bb8-8181-fcb84a6659ea",
		payerAlias: agent.payeeAlias,
		amount: req.body.amount,
		currency: "SEK",
		message: req.body.message
	}

	const options = requestOptions('POST', `${agent.host}/api/v1/refunds`, json)

	request(options, (error, response, body) => {

		logResult(error, response)

		if (!response) {
			res.status(500).send(error)
			return
		}
		
		res.status(response.statusCode)
		if (response.statusCode == 201) { 

			const location = response.headers['location']
			const token = response.headers['paymentrequesttoken']
			const opt = requestOptions('GET', location)

			request(opt, (err, resp, bod) => {
				logResult(err, resp)

				const id = resp.body['id']
				const originalPaymentReference = resp.body['originalPaymentReference']
				const status = resp.body['status']

				res.json({
					url: location,
					token: token,
					originalPaymentReference: originalPaymentReference,
					status: status,
					id: id
				})
			})

		} else { 
			res.send(body)
			return
		} 	
	})
})

// Get Refund
app.get('/refunds/:refundId',  (req, res) => {

	const options = requestOptions('GET', `${agent.host}/api/v1/refunds/${req.params.refundId}`)

	console.log(req)

	request(options, (error, response, body) => {

		logResult(error, response)

		if (!response) {
			res.status(500).send(error)
			return
		}

		res.status(response.statusCode)
		if (response.statusCode == 200) {

			res.json({
				id: response.body['id'],
				originalPaymentReference: response.body['originalPaymentReference'] || "",
				status: response.body['status']
			})

		} else { 
			res.send(body)
			return
		}
	})
})

// Get QR Code
app.get('/qr/:token',  (req, res) => {
	const token = req.params.token
	const json = {
		token: token,
		size: "600",
		format: "png",
		border: "0"
	}

	const options = requestOptions('POST', `${agent.qrHost}/api/v1/commerce`, json)

	request(options, (error, response, body) => {
		logResult(error, response)
		if (!response) {
			res.status(500).send(error)
			return
		}
		
	}).pipe(res)
})


// ------------- helper functions

const requestOptions = (method, uri, body) => {
	return {
		method: method,
		uri: uri,
		json: true,
		body: body,
		'content-type': 'application/json',
		cert: fs.readFileSync(agent.cert),
		key: fs.readFileSync(agent.key),
		ca: agent.ca ? fs.readFileSync(agent.ca) : null,
		passphrase: agent.passphrase
	}
}

const logResult = (error, response) => {
	if (error) {			
		console.log(error)
	} 
	if (response) {
		console.log(response.statusCode)
		console.log(response.headers)
		console.log(response.body)
	}
}

app.listen(3000, () => console.log(`Swish-server is listening on port 3000`))
