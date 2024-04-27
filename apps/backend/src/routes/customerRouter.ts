import express from "express";
import {protect} from "../middleware/authMiddleware";
import {createCustomer, deleteCustomer, getCustomerById, getCustomers} from "../controllers";


export const customerRouter = express.Router()

customerRouter.route('/findAll')
    .get(protect, getCustomers)


customerRouter.route('/findById/:customerId')
    .get(protect, getCustomerById)

customerRouter.route('/delete/:customerId')
    .delete(protect, deleteCustomer)

customerRouter.route('/create')
    .post(protect, createCustomer)

