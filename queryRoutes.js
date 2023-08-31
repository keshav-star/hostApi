import { query } from "@el3um4s/node-mdb";
import Express from 'express';
import fs from 'fs';

const app = Express();
const port = process.env.PORT || 3000;
const database = "./Weighing_API.mdb";

async function fetchData(sql) {
    try {
        const result = await query.sql({ database, sql });
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

app.get('/', async (req, res) => {
    let sql = 'SELECT * FROM API_DATA';

    if (req.query.VehicleNo) {
        const vehicleNo = req.query.VehicleNo;
        sql = `SELECT * FROM API_DATA WHERE VehicleNo='${vehicleNo}'`;
    } else if (req.query.TRNo) {
        const trNo = req.query.TRNo;
        sql = `SELECT * FROM API_DATA WHERE TRNo='${trNo}'`;
    }

    const result = await fetchData(sql);
    const formattedResult = {};

    for (const item of result) {
        const { T_ID, WB_Location_ID, ...rest } = item;
        formattedResult[T_ID] = rest;
    }

    fs.writeFile('db.json', JSON.stringify(formattedResult, null, 2), (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
            return;
        }
        console.log('Data written to db.json');
    });

    res.send(JSON.stringify(formattedResult, null, 2));
});

app.listen(port, () => {
    console.log("Server started at port " + port);
});