'use strict';

const config = require('config');
const  mongoose  = require("mongoose");

class Db {
	
	constructor() {
		//const  url  =  "mongodb://localhost:27017/seaconnect";
		const  url  =  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
		const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });
	}
	query(sql, args) {
		return new Promise((resolve, reject) => {
			this.connection.query(sql, args, (err, rows) => {
				if (err)
					return reject(err);
				resolve(rows);
			});
		});
	}
	close() {
		return new Promise((resolve, reject) => {
			this.connection.end(err => {
				if (err)
					return reject(err);
				resolve();
			});
		});
	}
}
module.exports = new Db();
