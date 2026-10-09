const mongoose = require('mongoose');

const databaseConnect = () => {
    mongoose.set("strictQuery", false);
    return mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        serverSelectionTimeoutMS: 10000
    });
}

module.exports = databaseConnect;