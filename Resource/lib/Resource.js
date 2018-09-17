"use strict";

const DataItem = require('../../lib/DataItem');
const mysqlConfig = require('../../config').mysqlDB;
const tableName = 'resources';

class Resource extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  /**
   * Creates a new resource
   * @param {Object} resourceObject 
   * @returns {Promise<Array>} resolves to the entry results, rejects error with http style error
   */
  create(resourceObject) {
    return new Promise((resolve, reject) => {
      if (!resourceObject.email || !resourceObject.name) {
        return reject(this.validationError());
      }

      this.getConnection().then((connection) => {
        connection.query(`INSERT INTO ${this.tableName} (email, name) VALUES (?,?)`, [resourceObject.email, resourceObject.name], (error, results) => {
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

module.exports = Resource;