import dotEnv from"dotenv"

dotEnv.config();

export const utils = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    PORT: process.env.PORT || 8000,
    JWT_SECRET: process.env.JWT_SECRET as string,
    accountSid: process.env.accountSid as string,
    authToken: process.env.authToken as string,
    fromNumber:process.env.fromNumber as string,
    toNumber:process.env.toNumber as string
}