export interface Items {
    id: string,
    name: string,
    description?: string,
    stock: number,
    canBePurschased?: boolean,
    canBeSold?: boolean
}