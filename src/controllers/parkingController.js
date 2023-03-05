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

async function getSpotsEsp(req,res){
    try{
        const parkingSpots = await parkingRepository.getSpots();
        console.log(parkingSpots.rows)
        let reserved = ""
        parkingSpots.rows.forEach((spot)=>{
            reserved+=spot.reserved?"1":"0"
        })
        return res.send(reserved)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function saveSpotsEsp(req,res){
    const spots = req.body
    try{
        const parkingSpots = await parkingRepository.getSpots();
        console.log(parkingSpots.rows)

        parkingSpots.rows.forEach(async (spot,index)=>{
            console.log(spot.ocupied!=spots[index])
            if(spot.ocupied!=spots[index]) await parkingRepository.setSpot(spot.id,spots[index])
        })
        const parkingSpotsUpdated = await parkingRepository.getSpots();
        console.log(parkingSpotsUpdated.rows)
        return res.send(parkingSpotsUpdated.rows)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const parkingController = {getSpots,getSpotsEsp,saveSpotsEsp}