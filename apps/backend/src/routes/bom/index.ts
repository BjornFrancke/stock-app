import express from "express";
import {
    addComponent, createBom,
    deleteBom,
    getBomById,
    getBomDetails,
    getBoms, manufactureBom,
    removeComponent,
    setComponentAmount
} from "../../controllers";

const bomRouter = express.Router()

bomRouter.route('/findAll')
    .get(getBoms)

bomRouter.route('/findById/:bomId')
    .get(getBomById)

bomRouter.route('/bomDetailsById/:bomId')
    .get(getBomDetails);

bomRouter.route('/delete/:bomId')
    .delete(deleteBom)

bomRouter.route('/addComponent/:bomId')
    .patch(addComponent)

bomRouter.route('/removeComponent/:bomId/:componentId')
    .delete(removeComponent)

bomRouter.route('/setComponentAmount/:bomId/:componentId/:amount')
    .patch(setComponentAmount)

bomRouter.route('/create')
    .post(createBom)

bomRouter.route('/manufacture/:bomId')
    .patch(manufactureBom)

export default bomRouter