var settings = {
	secret: "9jk9slsadxj8xHnJkdu7tr6svdhjs7g7",
	
	Mongo: {
		db: "beta",
		user: "betaapp123",
		pass: "k032j0s9djpsfjjjx99987hOIds8hsipso98",
		path: "ds035027.mongolab.com:35027"
	},
	
	Redis: {
		host: '50.30.35.9', 
		port: 2491, 
		db: "beta",
		pass: "d5b6c54c9e60927ea68c9e1f5fccd766"
	},
	
	auth: {
		BASE: "http://localhost:3000/auth/",
		REALM: 'http://localhost:3000/'
	}
};

settings.Mongo.url = "mongodb://"
	+settings.Mongo.user+":"+settings.Mongo.pass+"@"
	+settings.Mongo.path+"/"+settings.Mongo.db
	
module.exports = settings;
