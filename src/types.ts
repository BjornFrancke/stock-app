export interface Iitems {
    name: string,
    description?: string,
    stock: number,
}

export interface MongoDBCreds {
    user: string,
    password: string,
    path: string,
    appName: string
}