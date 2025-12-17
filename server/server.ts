import express from "express";
import { databaseApi } from "./databaseApi";
import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

// Bytte data til det du vil kalle den
const databaseName = "Dashboard_Data"


const app = express();

const client = new MongoClient(process.env["MONGODB_URL"]!);
client.connect().then(async (connection) => {
    const db = connection.db(databaseName);
    app.use((databaseApi(db)))
});

app.use(express.json());

app.listen(3000);