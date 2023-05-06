const mongoose = require('mongoose');

let db;

async function connectDB() {
    if (db) return db;

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooo4k.mongodb.net/inventory?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;
