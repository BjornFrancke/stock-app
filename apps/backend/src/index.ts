import express from "express";
import mongoose from "mongoose";
import {appPort, DATABASE_URL} from "./config";
import cors from "cors"
import {bomRouter, customerRouter, itemRouter, manufacturingRouter, ordersRouter, userRouter} from "./routes";

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
app.use('/bom', bomRouter)
app.use('/orders', ordersRouter)
app.use('/customer', customerRouter)
app.use("/manuOrder", manufacturingRouter)
app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`\u001b[36m-> Stock-app listening on port \u001b[37m \u001b[4m${port}\u001b[0m  🚀`)
})
