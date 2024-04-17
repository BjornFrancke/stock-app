// MongoDB
import 'dotenv/config'

export const appPort = process.env.PORT || 3000
const MONGO = {
    host : process.env.MONGO_HOST,
    user : process.env.MONGO_USER,
    password : process.env.MONGO_PASSWORD,
}

if (!MONGO.host || !MONGO.user || !MONGO.password) {
    console.log('Environment variables for MongoDB not set');
}


export const DATABASE_URL = `mongodb+srv://${MONGO.user}:${MONGO.password}@${MONGO.host}?retryWrites=true&w=majority&appName=$stock-app`
