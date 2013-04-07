var settings = {
	secret: "aaaxxx",
	
	Mongo: {
		db: "",
		user: "",
		pass: "",
		path: ""  // include port without trailing forward slash
	},
	
	Redis: {
		host: '',  // ip
		port: , 
		db: "",
		pass: ""
	},
	
	auth: {
		BASE: "http://localhost:3000/auth/", // include trailing forward slash
		REALM: 'http://localhost:3000/' // include trailing forward slash
	}
};

settings.Mongo.url = "mongodb://"
	+settings.Mongo.user+":"+settings.Mongo.pass+"@"
	+settings.Mongo.path+"/"+settings.Mongo.db
	
module.exports = settings;
