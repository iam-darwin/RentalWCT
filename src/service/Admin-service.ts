import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from 'jsonwebtoken';
import status from "http-status";

import { AdminInput,LoginInput } from "../intrefaces"
import { utils } from "../utils";
import { AdminRepository } from "../repository/index"
import { AppError } from "../utils/Errors";

export default class AdminService{
    adminService: AdminRepository;
    constructor(){
        this.adminService=new AdminRepository();
    }

    async createAdmin(data:AdminInput){
        try {
            const adminUser=await this.adminService.createAdmin(data);
            return adminUser;
        } catch (error) {
            //@ts-ignore
            throw error;
           
        }
    }

    async loginAdmin(data:LoginInput){
        try {
            const findAdmin=await this.adminService.getAdminByEmail(data.email);

            if (!findAdmin) {
                throw Error('No_Admin');
            }

            const passwordMatch= await bcrypt.compare(data.password,findAdmin.password);

            if(!passwordMatch){
                throw new Error("Password_Wrong")
            }
            const {adminId,name}=findAdmin
            const token = this.generateToken({adminId,name})

            return token;

        } catch (error) {
            //@ts-ignore
            console.log(error.message);
            //@ts-ignore
            console.log("Service layer error :",error.name )
            //@ts-ignore
            if(error.message=="Password_Wrong"){
                throw new AppError("Password_Wrong","Incorrect Password",status.UNAUTHORIZED)
            }
            //@ts-ignore
            if(error.message=="No_Admin"){
                throw new AppError("Email Invalid","User with email Not found",status.NOT_FOUND)
            }
        }
    }

    generateToken(data:JwtPayload){
        return jwt.sign({ adminId:data.adminId,name:data.name }, utils.JWT_SECRET, { expiresIn: '1h' });
    }
}