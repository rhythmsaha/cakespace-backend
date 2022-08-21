const { connect } = require("mongoose");

const connectDB = async () => {
    await connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((res) => {
            console.log(`Database Connected: ${res.connection.host}`);
        })
        .catch((err) => {
            console.log("Error: " + err.message);
        });
};

module.exports = connectDB;
