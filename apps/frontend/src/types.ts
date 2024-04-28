export interface Iitems {
    _id? : string,
    name: string,
    description?: string,
    stock: number,
    salePrice: {
        currency: string,
        amount: number
    }
}

export interface Ibom {
    _id?: string | undefined
    name: string,
    product: string,
    components: Icomponent[]
}

export interface Icomponent {
    id: string | undefined,
    _id?: string | undefined,
    name?: string
    amount: number
}

export interface Iorder {
    _id: string
    orderNumber?: number,
    items: [{_id?: string, name: string, amount: number, salesPrice: {amount: number, currency: string }}],
    createtionDate?: Date,
    dueDate: Date,
    receptian?: string,
    subTotal?: {
        amount: number,
        currency: string,
        vat?: number
    },
    isDone?: boolean
}
export interface Icustomer {
    _id: string,
    name: string,
    mailAdress: string,
    phoneNr?: string,
    address: Iaddress
}

export interface Iaddress {
    street: string,
    zip: number,
    city: string,
    country: string
}

export interface Iuser {
    _id?: string | undefined,
    name: string,
    email: string,
    password: string,
    token: string
}
