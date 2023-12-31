import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ecommerce",
};

export const connection = async () => {
  try {
    const connection = await mysql.createConnection(config);
    console.log(`MySQL was connected succefully 🎄🧨🎉`);
    return connection;
  } catch (err) {
    console.log(err);
  }
};
