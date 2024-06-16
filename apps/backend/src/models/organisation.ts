import {model} from "mongoose";
import {Iorganisation, OrganisationModel} from "../types";
import {organisationSchema} from "../schema/organisationSchema";


export const Organisation = model<Iorganisation, OrganisationModel>("Organisation", organisationSchema)
