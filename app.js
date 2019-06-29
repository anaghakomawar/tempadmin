const express = require ('express');
const app = express();
const morgan = require('morgan');// morgan call next function if problem occure
const bodyParser = require('body-parser');// this package use to formate json data 
const mongoose = require ('mongoose');

/*

            Include all the Routes Used

*/
// Routes which should handle requests - Core Admin
const userRoutes 					= require('./api/routes/coreAdmin/users');
const rolesRoutes					= require('./api/routes/coreAdmin/roles');
const masternotificationRoutes		= require('./api/routes/coreAdmin/masternotification');

mongoose.connect('mongodb://localhost/testadmin',{
	useNewUrlParser: true
})
mongoose.promise =global.Promise;

// process.env.MANGO_ATLAS_PW envirnmaent variable name
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));// urlencode true and false simple-body url data
app.use(bodyParser.json());// it show json data in good manner

app.use((req, res, next) =>{
	res.header("Access-Control-Allow-origin","*"); // use API from anywhere insted of * we use domain
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");

	if (req.method === 'OPTIONS') {
		req.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

/*

        Call the URL for Routes

*/
//URL's collection wise
app.use("/api/users", userRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/masternotifications",masternotificationRoutes);

// handle all other request which not found 
app.use((req, res, next) => {
	const error = new Error('Not Found Manual ERROR');
	error.status = 404;
	next(error);
		// when we get 404 error it send to next 
});

// it will handel all error in the application
app.use((error, req, res, next) => {
	// 500 type error is used when we use database
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	})
});

module.exports = app;

