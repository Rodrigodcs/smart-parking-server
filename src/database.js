import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const configDatabase = {
    connectionString: process.env.DATABASE_URL,
};
if (process.env.MODE === "production") configDatabase.ssl = false;

const connection = new Pool(configDatabase);

export default connection;