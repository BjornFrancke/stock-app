import express from "express";
import itemRouter from "./routes/items";
import {item, logItemData} from "./items";
import mongoose from "mongoose";
import {DATABASE_URL} from "./creds";

mongoose.connect(DATABASE_URL)
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express()
const port = 3000
app.use(express.json())


logItemData(item)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

app.use('/item', itemRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})