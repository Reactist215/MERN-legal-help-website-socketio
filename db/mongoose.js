// const mongoose = require('mongoose');
// const { logger } = require('../config/logModule');

// mongoose.Promise = global.Promise;

// const connect = () => {
//     mongoose.connect(
//         process.env.DATABASE_URL,
//         // { dbName: 'testDB' },
//         { useNewUrlParser: false, useCreateIndex: true, useUnifiedTopology: true },
//         err => {
//             if (err) {
//                 logger.error(err);
//                 return;
//             }

//             if (process.env.NODE_ENV !== 'test') {
//                 logger.info('[LOG=DB] Successfully connected to MongoDB');
//             }
//         }
//     );
// };

// connect();

// module.exports = { mongoose, connect };

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://valdi:Cg7JRoIr9kcN70fK@legal-chat.cotsa.mongodb.net/answersite-db?retryWrites=true&w=majority`;
// 'mongodb+srv://valdi:<Cg7JRoIr9kcN70fK>@legal-chat.cotsa.mongodb.net/<answersite-db>?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    console.log('[mongo client connection error]', err);
    // const collection = client.db('test').collection('devices');
    // perform actions on the collection object
    client.close();
});
