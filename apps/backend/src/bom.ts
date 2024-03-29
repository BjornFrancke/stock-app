import { HydratedDocument, Model, Schema, model } from "mongoose";
import { BomModel, Ibom } from "./types";
import { ObjectId } from "mongodb";

const bomSchema = new Schema<Ibom, BomModel>({
    name: String,
    product: ObjectId,
    components: [{id: ObjectId, amount: Number}]
})

export const Bom: BomModel = model<Ibom, BomModel>("Bom", bomSchema)

const bom: HydratedDocument<Ibom> = new Bom({
    name: "Computer",
    product: "6604926a5fd8093c2dff3ae2",
    components: [
        {id: "660339754c0d7079f47d7ae8", amount: 4},
        {id: "660332baa462006bba009fdd", amount: 2}
    ]

})


export function createBom() {
    const testData = bom
    bom.save()
}