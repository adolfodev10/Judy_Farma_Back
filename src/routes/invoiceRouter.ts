import { Router } from "express";
import { getDb } from "../modules/db";


const router = Router();

router.get('/', async (req, res) => {
    const db = await getDb();
    const invoices = await db.all('SELECT * FROM invoices');
    res.status(200).json(invoices);
});

export default router;
