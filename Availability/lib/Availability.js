"use strict";

const mysqlConfig = require("../../config").mysqlDB;
const DataItem = require('../../lib/DataItem');
const tableName = 'hours';
const moment = require('moment');
const _sqlDateTimeFormat = "YYYY-MM-DD HH:mm:ss";

class Availability extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  static get sqlDateTimeFormat() {
    return _sqlDateTimeFormat;
  }

  _checkAvailability(connection, desiredDateTime, durationMin, resourceId) {
    return new Promise((resolve, reject) => {
        let desiredEndDateTime = moment(desiredDateTime, _sqlDateTimeFormat).add(durationMin, 'minute').format(_sqlDateTimeFormat); 
        let escapedDesiredStartDateTime = connection.escape(desiredDateTime);
        let escapedDesiredEndDateTime = connection.escape(desiredEndDateTime);
        let escapedDOW = moment(escapedDesiredStartDateTime, _sqlDateTimeFormat).format('d');//connection.escape(dayOfWeek); // todo get DOW
        let escapedResourceId = connection.escape(resourceId);
        
        let query = `
        SELECT ${escapedDesiredStartDateTime} AS time, count(*) AS available FROM hours WHERE hours.resourceId = ${escapedResourceId}
            AND hours.DOW = ${escapedDOW} 
            AND hours.startTime <= CAST(${escapedDesiredStartDateTime} as time) 
            AND hours.endTime >= CAST(${escapedDesiredEndDateTime} as time)
            AND NOT EXISTS(
              SELECT 1 as exist
                FROM bookings b LEFT JOIN bookables a
                  ON b.bookableId = a.id
                WHERE b.resourceId = ${escapedResourceId}
                  AND ${escapedDesiredEndDateTime} > b.startDateTime
                  AND ${escapedDesiredStartDateTime} < ADDTIME(b.startDateTime, a.duration)
            );
        `;

        connection.query(query, (error, results, fields) => {
          if (error) {
            return reject(this.handleSqlError(error));
          }
          
          resolve(results[0]);
        });
    });
  }

  /**
   * 
   * @param {string} startDateTime 
   * @param {int} intervalMin 
   * @param {int} limit 
   * @param {string} bookableId 
   * @param {string} resourceId 
   */
  checkAvailabilities(startDateTime, intervalMin, limit, bookableId, resourceId) {
    return new Promise((resolve, reject) => {

      let getDurationQuery = 'SELECT duration FROM bookables WHERE id = ?';

      this.getConnection().then((connection) => {
        connection.query(getDurationQuery, bookableId, (error, result) => {
          if (error) {
            return reject(this.handleSqlError(error));
          }

          let durationMin = moment.duration(result[0].duration).as('minutes')

          let toBeChecked = [];
          for (let i = 0; i < limit; i++) {
            let _startDateTime = moment(startDateTime).add(intervalMin * i, 'minute').format(_sqlDateTimeFormat);
            let q = this._checkAvailability(connection, _startDateTime, durationMin, resourceId);
            toBeChecked.push(q);
          }

          Promise.all(toBeChecked).then(function (result) {
            resolve(result);
          }, reject);

        })
      }, (err) => {
        reject(this.dbConnectionError());
      })
    });
    
  }
}

module.exports = Availability;