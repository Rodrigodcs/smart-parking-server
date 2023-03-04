import { parkingRepository } from "../repositories/parkingRepository.js";

async function getSpots(req,res){
    try{
        const parkingSpots = await parkingRepository.getSpots();
        return res.send(parkingSpots.rows)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}



export const parkingController = {getSpots}