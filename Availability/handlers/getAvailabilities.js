"use strict";
/*
* get availabilities
*/

const Availability = require('../lib/Availability');
const availability = new Availability();
const moment = require("moment");
require("moment-round");

moment.relativeTimeRounding()

exports.getAvailabilities = function (event, context, callback) {
  const resourceId = decodeURIComponent(event.pathParameters.resourceId);
  const bookableId = decodeURIComponent(event.pathParameters.bookableId);
  console.info(`Getting availabilities: resourceId - ${resourceId}, bookableId - ${bookableId}`);
  let queryParams = event.queryStringParameters || {};
  const startDateTime = queryParams.start || moment().round(5, "minutes", "round").format(availability.sqlDateTimeFormat);
  const intervalMin = queryParams.interval || 15;
  const limit = queryParams.limit || 32;
  
  availability.checkAvailabilities(startDateTime, intervalMin, limit, bookableId, resourceId).then((results) => {
    const response = {
      "statusCode": 200,
      "body": JSON.stringify(results)
    };
    return callback(null, response);
  }).catch((err) => {
    return callback(null, err);
  })
};