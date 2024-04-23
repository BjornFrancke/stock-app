import express from "express";
import itemRouter from "./routes/items";
import warehouseRouter from "./routes/warehouses";
import mongoose from "mongoose";
import {appPort, DATABASE_URL} from "./config";
import cors from "cors"
import bomRouter from "./routes/bom";
import ordersRoute from "./routes/orders";
import customerRouter from "./routes/customer";
import manufacturingRouter from "./routes/manufacturing";
import {getNewManuOrderNumber} from "./manufacturing";
import userRoutes from "./routes/userRoutes";

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
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})
app.use('/item', itemRouter)
app.use('/warehouse', warehouseRouter)
app.use('/bom', bomRouter)
app.use('/orders', ordersRoute)
app.use('/customer', customerRouter)
app.use("/manuOrder", manufacturingRouter)
app.use("/user", userRoutes)

app.listen(port, () => {
    console.log(`Stock-app listening on port ${port}`)
})