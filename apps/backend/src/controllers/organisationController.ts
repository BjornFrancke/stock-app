import asyncHandler from "express-async-handler";
import {Organisation} from "../models/organisation";


export const getOrganisations = asyncHandler(async (req, res) => {
    const organisations = await Organisation.find();
    res.status(200).json(organisations);
})

export const createOrganisation = asyncHandler(async (req, res) => {
    const organisation = await Organisation.create(req.body);
    res.status(201).json(organisation);
})

