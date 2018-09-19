"use strict";
/*
* gets bookables by resourceId
*/

const Bookable = require('../lib/Bookable');
const bookable = new Bookable();

exports.getBookableByResourceId = function (event, context, callback) {
  let pathResourceId = decodeURIComponent(event.pathParameters.resourceId);
  console.info(`Getting bookable by resourceId: ${JSON.stringify(pathResourceId)}`)

  if (!pathResourceId) {
    console.warn(`Missing required parameters`);
    return callback(null, bookable.validationError());
  }

  bookable.getItemsByKeyValue([{key: 'resourceId', value: pathResourceId}]).then((results) => {
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