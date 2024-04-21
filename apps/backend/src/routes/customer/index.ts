import express from "express";
import {createCustomer, deleteCustomer, getCustomerById, getCustomers} from "../../controllers";
import {protect} from "../../middleware/authMiddleware";

const customerRouter = express.Router()

customerRouter.route('/findAll')
.get(protect, getCustomers)


customerRouter.route('/findById/:customerId')
.get(protect, getCustomerById)

customerRouter.route('/delete/:customerId')
.delete(protect, deleteCustomer)

customerRouter.route('/create')
.post(protect, createCustomer)



export default customerRouter