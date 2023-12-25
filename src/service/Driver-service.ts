import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from 'jsonwebtoken';
import status from "http-status";

import { DriverInput, LoginInput } from "../intrefaces";
import { DriverRepository } from "../repository";
import { utils } from "../utils/utilities";
import { AppError } from "../utils/Errors";

export default class DriverService{
    private driverRepo: DriverRepository;
    constructor(){
        this.driverRepo=new DriverRepository();
    }

    async createDriver(data:DriverInput){
        try {
            const driver=await this.driverRepo.createDriver(data);
            return driver
        } catch (error) {
            throw error
            
        }
    }

    async login(data:LoginInput){
        try {
            const findDriver=await this.driverRepo.getEmail(data.email);

            if(!findDriver){
                throw Error("No_Driver");
            }

            const passwordMatch= await bcrypt.compare(data.password,findDriver.password);

            if(!passwordMatch){
                throw new Error("Password_Wrong")
            }
            
            const{driverID,driverFirstName}=findDriver;
            const token=this.generateToken({driverID,driverFirstName})

            return token;

        } catch (error) {
            //@ts-ignore
            if(error.message=="No_Driver"){
                throw new AppError("No_Driver","Driver with the email doesn't exist",status.NOT_FOUND)
            }
            //@ts-ignore
            if(error.message=="Password_Wrong"){
                throw new AppError("Password_Wrong","Incorrect Password",status.UNAUTHORIZED)
            }
        }
    }

    generateToken(data:JwtPayload){
        return jwt.sign(data,utils.JWT_SECRET,{expiresIn:'2h'})
    }

    async getAssignedRides(driverId:string){
        try {
            const rides =await this.driverRepo.getAssignedRides(driverId);
            return rides;
        } catch (error) {
            throw error
        }
    }

    async getCompletedRidesDriver(driverId:string){
        try {
            const rides=await this.driverRepo.getCompletedRides(driverId);
            return rides;
        } catch (error) {
            throw error;
        }
    }

}