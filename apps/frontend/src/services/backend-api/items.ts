import {instance} from "./axiosConfig.ts";

export const deleteItem = async (id: string | undefined) => {
    if (typeof id === undefined) {
        return
    }
    await instance.delete(`/item/${id}`);
}

export const changeStock = async (id: string | undefined, newStockValue: number) => {
    if (typeof id === undefined) {
        console.warn('Cannot set stock of an item without an id')
        return
    }
    await instance.patch(`/item/setStock/${id}/${newStockValue}`);

}