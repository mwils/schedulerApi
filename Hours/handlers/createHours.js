"use strict";
/*
* creates an hours
*/

let Hours = require('../lib/Hours');
const hours = new Hours();

exports.createHours = function (event, context, callback) {
  let bodyParams;

  try {
    bodyParams = JSON.parse(event.body);
  } catch (e) {
    console.error(e);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Invalid JSON" }) });
  }

  hours.create(bodyParams).then((created) => {
    const response = {
      "statusCode": 200,
      "body": JSON.stringify({
        id: created.insertId
      })
    };
    return callback(null, response);
  }, err => {
    console.log(err);
    return callback(null, err)
  });
};