const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.DATABASE_CONNECTION_STR || "";

const connectToDB = async () => {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to MongoDB!');
  } catch (error) {
    console.error(`Error while connecting to MongoDB: `, error.message);
  }
};

module.exports = connectToDB;