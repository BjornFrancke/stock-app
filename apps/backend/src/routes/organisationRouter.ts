import express from "express";
import {protect} from "../middleware/authMiddleware";
import {addUserToOrganisation, createOrganisation, getOrganisations} from "../controllers";

export const organisationRouter = express.Router()


organisationRouter.route('/')
    .get(protect, getOrganisations)
    .post(protect, createOrganisation)
organisationRouter.route('/:organisationId')
    .patch(protect, addUserToOrganisation)
