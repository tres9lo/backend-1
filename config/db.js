const mongoose = require('mongoose');
const connectDB = async () => {
   
    mongoose.connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`Connected to MongoDB: ${conn.connection.host}`))
    .catch((error) => console.error('Database connection error:', error.message));

    
}

module.exports = connectDB;