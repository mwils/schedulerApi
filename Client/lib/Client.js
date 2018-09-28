"use strict";

const DataItem = require('../../lib/DataItem');
const mysqlConfig = require('../../config').mysqlDB;
const tableName = 'clients';

class Client extends DataItem {
  constructor() {
    super(mysqlConfig, tableName);
  }

  /**
   * Creates a new client
   * @param {Object} clientObject 
   * @returns {Promise<Array>} resolves to the entry results, rejects error with http style error
   */
  create(clientObject) {
    return new Promise((resolve, reject) => {
      if (!clientObject.email || !clientObject.name) {
        return reject(this.validationError());
      }

      this.getConnection().then((connection) => {
        connection.query(`INSERT INTO ${this.tableName} (email, name) VALUES (?,?)`, [clientObject.email, clientObject.name], (error, results) => {
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

module.exports = Client;