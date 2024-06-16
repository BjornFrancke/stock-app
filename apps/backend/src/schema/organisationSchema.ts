import {Schema} from "mongoose";
import {Iorganisation, OrganisationModel} from "../types";
import {ObjectId} from "mongodb";


export const organisationSchema = new Schema<Iorganisation, OrganisationModel>({
    name: String,
    users: [{_id: ObjectId, name: String, admin: "Boolean"}],
    items: [ObjectId],
    orders: [ObjectId],
    customers: [ObjectId],
    manufacturingOrders: [ObjectId],
    boms: [ObjectId]

})
