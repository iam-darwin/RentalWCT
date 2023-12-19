require('dotenv').config();


export const utils = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: process.env.PORT || 8000,
    JWT_SECRET: process.env.JWT_SECRET as string,    
}