import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

const dbConnection = () => {
  mongoose
    .connect(DB_URI)
    .then((res) => {
      console.log(`DB connected successfully!`);
    })
    .catch((err) => {
      console.log(err.message);
      setTimeout(dbConnection, 5000);
    });
};

export { dbConnection };
