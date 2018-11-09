"use strict";
/*
* get a resource
*/

const Resource = require('../lib/Resource');
const resource = new Resource();

exports.getResourceByEmail = function (event, context, callback) {
  let pathEmail = decodeURIComponent(event.pathParameters.email);
  console.info(`Getting resource by email: ${pathEmail}`)

  if (!pathEmail) {
    console.warn(`Missing required parameters`);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Missing required paramaters" }) })
  }

  resource.getItemsByKeyValue([{key: 'email', value: pathEmail}]).then((results) => {
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