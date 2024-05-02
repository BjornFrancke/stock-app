import express from "express";
import {protect} from "../middleware/authMiddleware";
import {createCustomer, deleteCustomer, getCustomerById, getCustomers} from "../controllers";


export const customerRouter = express.Router()

customerRouter.route('/')
    .get(protect, getCustomers)
    .post(protect, createCustomer)



customerRouter.route('/:customerId')
    .get(protect, getCustomerById)
    .delete(protect, deleteCustomer)




