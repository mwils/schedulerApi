"use strict";
/*
* creates a bookable
*/

let Bookable = require('../lib/Bookable');
const bookable = new Bookable();

exports.createBookable = function (event, context, callback) {
  let bodyParams;

  try {
    bodyParams = JSON.parse(event.body);
  } catch (e) {
    console.error(e);
    return callback(null, { "statusCode": 400, "body": JSON.stringify({ "message": "Invalid JSON" }) });
  }

  bookable.create(bodyParams).then((created) => {
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