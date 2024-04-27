import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    addComponent,
    createBom,
    deleteBom,
    getBomById,
    getBomDetails,
    getBoms,
    manufactureBom,
    removeComponent,
    setComponentAmount
} from "../controllers";


export const bomRouter = express.Router()

bomRouter.route('/findAll')
    .get(protect, getBoms)

bomRouter.route('/findById/:bomId')
    .get(protect, getBomById)

bomRouter.route('/bomDetailsById/:bomId')
    .get(protect, getBomDetails);

bomRouter.route('/delete/:bomId')
    .delete(protect, deleteBom)

bomRouter.route('/addComponent/:bomId')
    .patch(protect, addComponent)

bomRouter.route('/removeComponent/:bomId/:componentId')
    .delete(protect, removeComponent)

bomRouter.route('/setComponentAmount/:bomId/:componentId/:amount')
    .patch(protect, setComponentAmount)

bomRouter.route('/create')
    .post(protect, createBom)

bomRouter.route('/manufacture/:bomId')
    .patch(protect, manufactureBom)

