import express from "express";
import itemRouter from "./routes/items";
import warehouseRouter from "./routes/warehouses";
import mongoose from "mongoose";
import {appPort, DATABASE_URL} from "./config";

mongoose.connect(DATABASE_URL)
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const app = express()
const port = appPort
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.use('/item', itemRouter)
app.use('/warehouse', warehouseRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})