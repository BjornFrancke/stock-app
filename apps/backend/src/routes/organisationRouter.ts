import express from "express";
import {protect} from "../middleware/authMiddleware";
import {
    addEntryToOrganisationController,
    addUserToOrganisation,
    checkIfUserDataHasOrganisation,
    createOrganisation, getOrganisationById,
    getOrganisations
} from "../controllers";

export const organisationRouter = express.Router()


organisationRouter.route('/')
    .get(protect, getOrganisations)
    .post(protect, createOrganisation)
organisationRouter.route('/:organisationId')
    .patch(protect, addUserToOrganisation)
    .get(protect, getOrganisationById)

organisationRouter.route("/checkIfUserDataHasOrganisation")
    .post(protect, checkIfUserDataHasOrganisation)

organisationRouter.route("/addEntry")
    .post(addEntryToOrganisationController)
