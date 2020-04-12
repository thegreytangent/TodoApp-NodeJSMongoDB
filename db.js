const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const MongoOptions = { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
};
const state = {
    db: null
}


const connect = (cb) => {
    if (state.db) {
        cb();
    } else {
        MongoClient.connect("mongodb://localhost:27017",MongoOptions, (err, client) => {
            if (err) {
                cb(err)
            } else {
                state.db = client.db("crud_mongodb");
                cb();
            };
        });
    }
}

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}

module.exports = {
    getDB, connect, getPrimaryKey
};
