import { DriverInput } from "../intrefaces";
import { DriverRepository } from "../repository";

export default class DriverService{
    driverRepo: DriverRepository;
    constructor(){
        this.driverRepo=new DriverRepository();
    }

    async createDriver(data:DriverInput){
        try {
            const driver=await this.driverRepo.createDriver(data);
            return driver
        } catch (error) {
            //@ts-ignore
            console.log("error in service layer: ", error.message);
            throw error
            
        }
    }

}