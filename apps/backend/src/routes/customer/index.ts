import express from "express";
import {createCustomer, deleteCustomer, getCustomerById, getCustomers} from "../../controllers";

const customerRouter = express.Router()

customerRouter.route('/findAll')
.get(getCustomers)


customerRouter.route('/findById/:customerId')
.get(getCustomerById)

customerRouter.route('/delete/:customerId')
.delete(deleteCustomer)

customerRouter.route('/create')
.post(createCustomer)



export default customerRouter