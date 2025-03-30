const mongoose = require('mongoose');

const dbURL = "mongodb+srv://Abhishek:Abhi3191@cluster0.0kpk0m5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB Atlas Successfully!");
    } catch (error) {
        console.error("❌ Connection Error:", error);
    } finally {
        mongoose.connection.close();
    }
}

testConnection();
