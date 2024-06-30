import express from "express";
import mongoose from "mongoose";
import {appPort, DATABASE_URL} from "./config";
import cors from "cors"
import {
    bomRouter,
    customerRouter,
    itemRouter,
    manufacturingRouter,
    ordersRouter,
    organisationRouter,
    userRouter
} from "./routes";
import pc from "picocolors"


mongoose.connect(DATABASE_URL)
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log(`${pc.cyan(`➜ Database connected`)}`)
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
app.use("/organisation", organisationRouter)

app.listen(port, () => {
    console.clear()
    console.log(`${pc.bgWhite(`${pc.black('                 Stock-app backend                 ')}`)}`)
    console.log(" ")
    console.log(`${pc.cyan(`➜ Listening on port ${pc.underline(`${pc.white(`${port}`)}`)}`)} 🚀`)
})
