"use strict";

const mysql = require('mysql');

class DataItem {
  constructor(sqlConfig, tableName) {
    this.sqlConfig = sqlConfig;
    this.tableName = tableName;
  }

  validationError(msg) {
    return {
      statusCode: 400,
      message: `Invalid request ${msg}`.trim()
    };
  }

  dbConnectionError(msg) {
    return {
      statusCode: 500,
      message: `Internal server error`
    };
  }

  dbDuplicateEntryError() {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: `User already exists`
      })
    }
  }

  dbUnknownError() {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error`
      })
    }
  }


  handleSqlError(error) {
    console.error(`Database error: ${JSON.stringify(error)}`);
    
    const errorCode = parseInt(error.errno, 10);
    let _error;
    switch(errorCode) {
      case 1061:
      case 1062:
        _error = this.dbDuplicateEntryError();
        break;
      default:
        _error = this.dbUnknownError();
    }

    return _error;
  }
  
  getConnection() {
    return new Promise((resolve, reject) => {
      let connection = mysql.createConnection({
        host: this.sqlConfig.sqlHost,
        database: this.sqlConfig.sqlDB,
        user: this.sqlConfig.sqlUsername,
        password: this.sqlConfig.sqlPassword
      });

      connection.connect(function (err) {
        if (err) {
          console.error("Error making db connection: ", err.sqlMessage);
          connection.end();
          return reject(err);
        } else {
          return resolve(connection);
        }
      });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.getConnection().then((connection) => {
        connection.query(`SELECT * FROM ${this.tableName}`, function (error, results, fields) {
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

  /**
   * gets items from database based on an array key value pairs
   * @param {[Object]} keyValues Array of objects with key: 'keyname', value: 'valueToMatch'
   */
  getItemsByKeyValue(keyValues) {
    let query = `SELECT * FROM ${this.tableName} WHERE 1`;
    let values = [];

    for (let item of keyValues) {
      if (!item.key || !item.value) {
        console.warn(`Skipping item. Missing key or value: ${JSON.stringify(item)}`);
        continue;
      }

      query += ` and ${item.key}=?`;
      values.push(item.value);
    }

    return new Promise((resolve, reject) => {
      this.getConnection().then((connection) => {
        connection.query(query, values, function (error, results, fields) {
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

  /*
  connection.query("SELECT * FROM roles WHERE deptid=?", [event.pathParameters.deptid], function (error, results, fields) {
      if (error) {
        console.error("Database error: ", error.sqlMessage);
        connection.end();
        return callback(null, {"statusCode": 500, "body": JSON.stringify({"message": "Database error"})});
      }
      connection.end();
      return callback(null, {"body": JSON.stringify(results)});
    });
    */

  deleteById() {

  }
}

module.exports = DataItem;