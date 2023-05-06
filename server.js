const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: '.env' });
const colors = require('colors');
const app = require('./app');
const connectDB = require('./utils/connectDB');

const port = process.env.PORT || 5000;

// connect to database
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});

// if express can't handle the error, then we can use process.on('uncaughtException') to handle the error. but it's not recommended. instead we can use error handling middleware. example is in middlewares\errorHandler.js
process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    app.close(() => {
        process.exit(1);
    });
});
