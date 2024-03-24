export interface Items {
    id: string,
    name: string,
    description?: string,
    stock: number,
    canBePurschased?: boolean,
    canBeSold?: boolean
}

export interface MongoDBCreds {
    user: string,
    password: string,
    path: string,
    appName: string
}