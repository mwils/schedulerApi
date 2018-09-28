"use strict";
/*
* creates a client
*/

const Client = require('../lib/Client');
const client = new Client();

exports.createClient = function (event, context, callback) {
  let bodyParams;

  try {
    bodyParams = JSON.parse(event.body);
  } catch (e) {
    console.error(e);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Invalid JSON" }) });
  }

  if (!bodyParams.email || !bodyParams.name) {
    console.warn(`Missing required parameters`);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Missing required paramaters" }) })
  }

  let clientId;
  
  client.create(bodyParams).then((created) => {
    const response = {
      "statusCode": 200,
      "body": JSON.stringify({
        id: created.insertId
      })
    };

    return callback(null, response);
  }, (err) => {
    console.log(err);
    return callback(null, err)
  });

};