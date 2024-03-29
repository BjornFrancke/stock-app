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
    components: Icomponent[]
}

export interface Icomponent {
    id: string | undefined,
    name?: string
    amount: number
}

export interface Iorder {
    _id?: string | undefined
    orderNumber: number,
    items?: {_id?: string | undefined, amount: number}[]
    createtionDate: Date,
    dueDate: Date,
    receptian?: string
}