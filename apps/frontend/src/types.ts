export interface Iitems {
    _id? : string | undefined,
    name: string,
    description?: string,
    stock: number,
}

export interface Ibom {
    _id?: string | undefined
    name: string,
    product: string,
    components: [{id: string | undefined, amount: number}]
}