import asyncHandler from "express-async-handler";
import {Organisation} from "../models/organisation";
import {User} from "../models";


export const getOrganisations = asyncHandler(async (req, res) => {
    const organisations = await Organisation.find();
    res.status(200).json(organisations);
})


export const getOrganisationById = asyncHandler(async (req, res) => {
    const organisation = await Organisation.findById(req.params.organisationId)
    res.status(200).json(organisation)
})

export const createOrganisation = asyncHandler(async (req, res) => {
   // const organisation = await Organisations.create(req.body);
    const organisation = new Organisation({
        name: req.body.name,
        users: [],
        items: [],
        orders: [],
        customers: [],
        manufacturingOrders: [],
        boms: []
    });
    const newOrganisation = await organisation.save();
    res.status(201).json(newOrganisation);
})




export const addUserToOrganisation = asyncHandler(async (req, res) => {
    console.log(req.params.organisationId);
    const organisation = await Organisation.findById(req.params.organisationId);
    const user = await User.findById(req.body.userId);
    if (user && organisation) {
        organisation?.users.push({_id: user._id, name: user.name, admin: false});
        organisation.save()
        res.status(201).json({message: `${user.name} added successfully.`});
    } else {
        res.status(404).json({message: "Something went wrong"});
    }
})

export const checkIfUserDataHasOrganisation = asyncHandler (async (req, res) => {
    const listOfOrganisations = await Organisation.find()
    if (!listOfOrganisations) {
res.status(404).json({message: "No organisations found"});
    return
    }

    for (let i = 0; listOfOrganisations.length > 0; i++) {
        const organisation = listOfOrganisations[i]
        const users = listOfOrganisations[i].users
        for (let j = 0; j < users.length; j++) {
            const user = await User.findById(users[j])
            if (user && user?.organisation != organisation._id) {
                user.organisation = organisation._id
                console.log(user.name + " now has organisation" + organisation.name)
                await user.save()
            }
        }
    }
    res.status(200)
})


