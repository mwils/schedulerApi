"use strict";
/*
* gets hours by resourceId
*/

const Hours = require('../lib/Hours');
const hours = new Hours();

exports.getHoursByResourceId = function (event, context, callback) {
  let pathResourceId = decodeURIComponent(event.pathParameters.resourceId);
  console.info(`Getting hours by resourceId: ${JSON.stringify(pathResourceId)}`)

  if (!pathResourceId) {
    console.warn(`Missing required parameters`);
    return callback(null, hours.validationError());
  }

  hours.getItemsByKeyValue([{key: 'resourceId', value: pathResourceId}]).then((results) => {
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