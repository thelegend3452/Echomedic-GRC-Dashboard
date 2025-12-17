import express, { Router } from "express";
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(express.json());

const databaseName = "Dashboard_Data";
let cachedDb: Db | null = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;

    const uri = process.env["MONGODB_URL"];
    if (!uri) {
        throw new Error("MONGODB_URL is missing in environment variables");
    }

    const client = new MongoClient(uri);
    const connection = await client.connect();
    cachedDb = connection.db(databaseName);
    return cachedDb;
}

const router = Router();
const riskdata = "riskdata";
const complianceData = "complianceData";
const employeedata = "employeeData";

router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
});

router.get("/compliance", async (req, res) => {
    const db = await connectToDatabase();
    const settlements = await db.collection(complianceData).find({}).toArray();
    res.json(settlements);
});

router.post("/compliance", async (req, res) => {
    const db = await connectToDatabase();
    const data = { ...req.body };
    try {
        await db.collection(complianceData).updateOne(
            { id: data.id },
            { $set: data },
            { upsert: true }
        );
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: "Error saving compliance" });
    }
});

router.delete("/compliance/:id", async (req, res) => {
    const db = await connectToDatabase();
    try {
        const result = await db.collection(complianceData).deleteOne({ id: req.params.id });
        result.deletedCount === 1 ? res.sendStatus(200) : res.status(404).send("Not found");
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/compliance/iso", async (req, res) => {
    const db = await connectToDatabase();
    const data = await db.collection(complianceData).find({ type: "I.S.O" }).toArray();
    res.json(data);
});

router.get("/compliance/norman", async (req, res) => {
    const db = await connectToDatabase();
    const data = await db.collection(complianceData).find({ type: "Norman" }).toArray();
    res.json(data);
});

router.get("/risk", async (req, res) => {
    const db = await connectToDatabase();
    const settlements = await db.collection(riskdata).find({}).toArray();
    res.json(settlements);
});

router.post("/risk", async (req, res) => {
    const db = await connectToDatabase();
    try {
        await db.collection(riskdata).updateOne(
            { id: req.body.id },
            { $set: req.body },
            { upsert: true }
        );
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete("/risk/:id", async (req, res) => {
    const db = await connectToDatabase();
    try {
        const result = await db.collection(riskdata).deleteOne({ id: req.params.id });
        result.deletedCount === 1 ? res.sendStatus(200) : res.status(404).send("Not found");
    } catch (error) {
        res.sendStatus(500);
    }
});

// --- Employee Endpoints ---
router.get("/employee", async (req, res) => {
    const db = await connectToDatabase();
    const data = await db.collection(employeedata).find({}).toArray();
    res.json(data);
});

router.post("/employee", async (req, res) => {
    const db = await connectToDatabase();
    try {
        await db.collection(employeedata).updateOne(
            { id: req.body.id },
            { $set: req.body },
            { upsert: true }
        );
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.delete("/employee/:id", async (req, res) => {
    const db = await connectToDatabase();
    try {
        const result = await db.collection(employeedata).deleteOne({ id: req.params.id });
        result.deletedCount === 1 ? res.sendStatus(200) : res.status(404).send("Not found");
    } catch (error) {
        res.sendStatus(500);
    }
});

app.use("/.netlify/functions/api", router);
app.use("/api", router);
app.use("/", router);

app.use((req, res) => {
    console.error(`Route not found: ${req.originalUrl}`);
    res.status(404).json({
        error: "Not Found",
        route: req.originalUrl
    });
});

export const handler = serverless(app);