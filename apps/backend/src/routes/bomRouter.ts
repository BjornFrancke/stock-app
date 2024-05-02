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

bomRouter.route('/')
    .get(protect, getBoms)
    .post(protect, createBom)


bomRouter.route('/:bomId')
    .get(protect, getBomById)
    .delete(protect, deleteBom)

bomRouter.route('/:bomId/component')
    .post(protect, addComponent)

bomRouter.route('/:bomId/component/:componentId')
    .delete(protect, removeComponent)

bomRouter.route('/bomDetailsById/:bomId')
    .get(protect, getBomDetails);



bomRouter.route('/setComponentAmount/:bomId/:componentId/:amount')
    .patch(protect, setComponentAmount)

bomRouter.route('/manufacture/:bomId')
    .patch(protect, manufactureBom)

