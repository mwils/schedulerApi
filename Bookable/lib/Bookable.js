"use strict";

const DataItem = require('../../lib/DataItem');
const mysqlConfig = require('../../config').mysqlDB;
const tableName = 'bookables';

class Bookable extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  /**
   * Creates a new bookable
   * A bookable is a bookable item, an example would be a mens haircut
   * @param {Object} bookableObject 
   * @returns {Promise<Array>} resolves to the entry results, rejects error with http style error
   */
  create(bookableObject) {
    return new Promise((resolve, reject) => {
      if (!bookableObject.label || !bookableObject.duration || !bookableObject.resourceId) {
        return reject(this.validationError());
      }

      let insertObject = {
        label: bookableObject.label,
        duration: bookableObject.duration,
        resourceId: bookableObject.resourceId,
        minNotice: bookableObject.minNotice,
        minCancelNotice: bookableObject.minCancelNotice,
        maxFuture: bookableObject.maxFuture
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

module.exports = Bookable;