import {Organisation} from "../models/organisation";
import {ObjectId} from "mongodb";

interface EntryToOrganisation {
    orgId: string;
    typeOfEntry: "BOM" | "Item" | "Order";
    idOfEntry: ObjectId;
}

// Add bom, items or order to an organisation.
export async function addEntryToOrganisation(orgId: ObjectId, typeOfEntry: "BOM" | "Item" | "Order", idOfEntry: ObjectId) {
    const orgData = await Organisation.findById(orgId)
    if (!orgData) {
        return
    }
    switch (typeOfEntry) {
        case "BOM":
            orgData.boms.push(idOfEntry)
            break;
        case "Item":
            orgData.items.push(idOfEntry)
            break;
        case "Order":
            orgData.orders.push(idOfEntry)
            break
    }
    orgData.save()
    return orgData
}


// Remove
async function deleteEntryToOrganisation({orgId, typeOfEntry, idOfEntry}: EntryToOrganisation) {
    const orgData = await Organisation.findById(orgId)
    if (!orgData) {
        return
    }
    const index = orgData.boms.findIndex((id) => id === idOfEntry)
    orgData.boms.splice(index, 1)
    orgData.save()
    return
}


//Display organisations boms, items etc.
