import express from "express";
import { Customer } from "../../models/customers";

const customerRouter = express.Router()

customerRouter.route('/findAll')
.get(async (req, res) => {
    try {
        const data = await Customer.find()
        res.json(data)
    } catch (error) {
        res.status(500).send("Internal Server Error " + error)
    }
})


customerRouter.route('/findById/:customerId')
.get(async (req, res) => {
    const id = req.params.customerId
    try {
        const data = await Customer.findById(id)
        res.json(data)
    } catch (error) {
        res.status(500).send("Internal Server Error " + error)
    }
})

customerRouter.route('/delete/:customerId')
.delete(async (req, res) => {
    const id = req.params.customerId
    try {
        const customerData = await Customer.findById(id)
        if (!customerData) {
            res.status(404).send("Customer not found")
        }
        const deletedCustomer = await Customer.findByIdAndDelete(id)
        res.json(deletedCustomer)
    } catch (error) {
        res.status(500).send("Internal Server Error " + error)
    }
})

customerRouter.route('/create')
.post(async (req, res) => {
    try {
    const newCustomer = new Customer( {
        name: req.body.name,
        mailAdress: req.body.mailAdress,
        phoneNr: req.body.phoneNr,
        address: {
            street: req.body.address.street,
            zip: req.body.address.zip,
            city: req.body.address.city,
            country: req.body.address.country
        }
    })
    const savedCustomer = await newCustomer.save()
    res.json(savedCustomer)
} catch (error) {
        res.status(500).send("Internal Server Error" + error)
    }
})



export default customerRouter