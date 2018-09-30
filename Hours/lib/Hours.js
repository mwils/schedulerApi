"use strict";

const DataItem = require('../../lib/DataItem');
const mysqlConfig = require('../../config').mysqlDB;
const tableName = 'hours';

class Hours extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  /**
   * Creates a new hours
   * DOW 0 = Sunday per momentjs
   * @param {Object} hoursObject 
   * @returns {Promise<Array>} resolves to the entry results, rejects error with http style error
   */
  create(hoursObject) {
    return new Promise((resolve, reject) => {
      console.info(`Creating new hours: ${JSON.stringify(hoursObject)}`);
      if (!hoursObject.DOW || !hoursObject.startTime || !hoursObject.endTime || !hoursObject.resourceId) {
        console.log('non valid')
        return reject(this.validationError());
      }

      let insertObject = {
        DOW: hoursObject.DOW,
        startTime: hoursObject.startTime,
        endTime: hoursObject.endTime,
        resourceId: hoursObject.resourceId
      };

      let query = `INSERT INTO ${this.tableName} SET ?`

      this.getConnection().then((connection) => {
        connection.query(query, insertObject, (error, results) => {
          if (error) {
            return reject(this.handleSqlError(error));
          } else {
            resolve(results);
          }

          connection.end();
        });
      }, (err) => {
        console.error(`Error getting database connection: ${JSON.stringify(err)}`);
        reject({statusCode: 500, message: 'Internal server error'});
      });
    });
  }
}

module.exports = Hours;