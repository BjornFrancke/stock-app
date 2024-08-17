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
    _id: string
    name: string,
    product: string,
    components: Icomponent[]
}

export interface Icomponent {
    id: string | undefined,
    _id?: string | undefined,
    name?: string,
    amount: number,
    salePrice?: {
        currency?: string,
        amount?: number
    }


}

export interface Iorder {
    _id: string
    orderNumber?: number,
    items: [{_id?: string, name: string, amount: number, salesPrice: {amount: number, vat?: number, discount: number, currency: string }}],
    createtionDate?: Date,
    dueDate: Date,
    receptian?: string,
    subTotal?: {
        amount: number,
        currency: string,
        vat?: number,
        discount?: number,
        total?: number
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


export interface Iorganisation {
    _id: string,
    name: string,
    users?:[{_id?: string, name: string, admin?: boolean}],
    items?: string[],
    orders?: string[],
    customers?: string[],
    manufacturingOrders?: string[],
    boms?: string[]
}
