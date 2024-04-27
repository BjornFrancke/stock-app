import {BomModel, Ibom} from "../types";
import {model} from "mongoose";
import {bomSchema} from "../schema/bomSchema";


export const Bom: BomModel = model<Ibom, BomModel>("Bom", bomSchema)
