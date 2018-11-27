"use strict";
/*
* deletes an hours
*/

let Hours = require('../lib/Hours');
const hours = new Hours();

exports.deleteHours = function (event, context, callback) {
  let id = event.pathParameters.hoursId;

  if (!id) {
    console.error(`Delete hours error: id is ${id}`);
    return callback(null, { "statusCode": 500, "body": JSON.stringify({ "message": "Internal error" }) });
  }

  hours.deleteById(id).then((result) => {
    const response = {
      "statusCode": 200,
      "body": JSON.stringify({
        message: "OK"
      })
    };
    return callback(null, response);
  }, err => {
    console.log(err);
    return callback(null, err)
  });
};