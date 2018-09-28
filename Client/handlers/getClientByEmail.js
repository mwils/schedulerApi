"use strict";
/*
* get a client
*/

const Client = require('../lib/Client');
//import Client from "../lib/Client";
const client = new Client();

exports.getClientByEmail = function (event, context, callback) {
  let pathEmail = decodeURIComponent(event.pathParameters.email);
  console.info(`Getting client by email: ${pathEmail}`)

  if (!pathEmail) {
    console.warn(`Missing required parameters`);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Missing required paramaters" }) })
  }

  client.getItemsByKeyValue([{key: 'email', value: pathEmail}]).then((results) => {
    const response = {
      "statusCode": 200,
      "body": JSON.stringify(results)
    };
    return callback(null, response);
  }, err => {
    console.log(err);
    return callback(null, err);
  });
};