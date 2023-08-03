const { MongoClient } = require("mongodb");

const client = new MongoClient(
  `mongodb+srv://chandu_V:${process.env.MONGO_PASS}@cluster0.ueuz9jd.mongodb.net/chanduv7Edtech`,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);

const db = client.db();

const Courses = db.collection("Courses");
const Topics = db.collection("Topics");
const Subscriptions = db.collection("Subscriptions");
const Payment = db.collection("Payment");

module.exports = { Courses, Topics, Subscriptions, Payment };
