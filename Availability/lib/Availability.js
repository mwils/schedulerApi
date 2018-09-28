"use strict";

const DataItem = require('../../lib/DataItem');
const tableName = 'hours';

class Availability extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  checkAvailability(desiredTime, dayOfWeek, resourceId) {
    return new Promise((resolve, reject) => {
      this.getConnection().then((connection) => {
        let escapedDesiredTime = connection.escape(desiredTime);
        let escapedDOW = connection.escape(dayOfWeek);
        let escapedResourceId = connection.escape(resourceId);

        let query = `
        SELECT count(*) AS isAvailable
          FROM hours, bookings
          WHERE hours.resourceId = ${escapedResourceId}
            AND hours.DOW = ${escapedDOW} 
            AND hours.startTime <= ${escapedDesiredTime} 
            AND hours.endTime > ${escapedDesiredTime}
            AND NOT EXISTS(
              SELECT bookings.startDateTime, bookables.duration
                FROM bookings, bookables
                WHERE bookings.resourceId = ${escapedResourceId}
                AND CAST(bookings.startDateTime as time) <= ${escapedDesiredTime}
                AND ADDTIME(CAST(bookings.startDateTime as time), bookables.duration) > ${escapedDesiredTime}
        `;

        connection.query(query, function (error, results, fields) {
          if (error) {
            return reject(this.handleSqlError(error));
          }

          connection.end();
          resolve(results);
        });
      }, (error) => {
        return reject(this.handleSqlError(error));
        // handle connection error
      });
    });
  }
}



module.exports = Availability;