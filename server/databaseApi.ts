import express from "express";
import { Db } from "mongodb";

export function databaseApi(db: Db) {
    const router = express.Router();

    const riskdata = "riskdata";
    const complianceData = "complianceData";
    const employeedata = "employeeData"

    router.get("/api/compliance", async (req, res) => {
        const settlements = await db.collection(complianceData).find({}).toArray();
        res.json(settlements);
    });

    router.post("/api/compliance", async (req, res) => {
        const data = {
            id: req.body.id,
            type: req.body.type,
            code: req.body.code,
            name: req.body.name,
            description: req.body.description,
            measures: req.body.measures,
            lastAudited: req.body.lastAudited,
            status: req.body.status
        };

        try {
            await db.collection(complianceData).updateOne(
                { id: data.id },
                { $set: data },
                { upsert: true }
            );
            res.sendStatus(200);
        } catch (error) {
            console.error("Error saving compliance:", error);
            res.sendStatus(500);
        }
    });

    router.delete("/api/compliance/:id", async (req, res) => {
        const id = req.params.id;

        try {
            const result = await db.collection(complianceData).deleteOne({ id: id });

            if (result.deletedCount === 1) {
                res.sendStatus(200);
            } else {
                res.status(404).send("Item not found");
            }
        } catch (error) {
            console.error("Error deleting compliance:", error);
            res.sendStatus(500);
        }
    });

    router.get("/api/compliance/iso", async (req, res) => {
        try {
            const isoData = await db.collection(complianceData)
                .find({ type: "I.S.O" })
                .toArray();

            res.json(isoData);
        } catch (error) {
            console.error("Error fetching ISO data:", error);
            res.sendStatus(500);
        }
    });
    router.get("/api/compliance/norman", async (req, res) => {
        try {
            const isoData = await db.collection(complianceData)
                .find({ type: "Norman" })
                .toArray();

            res.json(isoData);
        } catch (error) {
            console.error("Error fetching Norman data:", error);
            res.sendStatus(500);
        }
    });



    router.get("/api/risk", async (req, res) => {
        const settlements = await db.collection(riskdata).find({}).toArray();
        res.json(settlements);
    });

    router.post("/api/risk", async (req, res) => {
        const data = {
            id: req.body.id,
            description: req.body.description,
            category: req.body.category,
            score: req.body.score,
            owner: req.body.owner,
            status: req.body.status
        };

        try {
            await db.collection(riskdata).updateOne(
                { id: data.id },
                { $set: data },
                { upsert: true }
            );
            res.sendStatus(200);
        } catch (error) {
            console.error("Error saving risk:", error);
            res.sendStatus(500);
        }
    });

    router.delete("/api/risk/:id", async (req, res) => {
        const id = req.params.id;

        try {
            const result = await db.collection(riskdata).deleteOne({ id: id });

            if (result.deletedCount === 1) {
                res.sendStatus(200);
            } else {
                res.status(404).send("Item not found");
            }
        } catch (error) {
            console.error("Error deleting risk:", error);
            res.sendStatus(500);
        }
    });

    router.post("/api/employee", async (req, res) => {

        const data = {
            id: req.body.id,
            name:req.body.name,
            email: req.body.email,
            role: req.body.role,
            department: req.body.department,
            startDate: req.body.startDate,
            progress: req.body.progress,
            status: req.body.status,
            avatarColor: req.body.avatarColor,
            initials: req.body.initials,
            checklist: req.body.checklist

        }

        try {
            await db.collection(employeedata).updateOne(
                { id: data.id },
                { $set: data },
                { upsert: true }
            );
            res.sendStatus(200);
        } catch (error) {
            console.error("Error saving employee:", error);
            res.sendStatus(500);
        }
    });

    router.get("/api/employee", async (req, res) => {
        const settlements = await db.collection(employeedata).find({}).toArray();
        res.json(settlements);
    });


    router.delete("/api/employee/:id", async (req, res) => {
        const id = req.params.id;

        try {
            const result = await db.collection(employeedata).deleteOne({ id: id });

            if (result.deletedCount === 1) {
                res.sendStatus(200);
            } else {
                res.status(404).send("Item not found");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            res.sendStatus(500);
        }
    });

    return router;
}