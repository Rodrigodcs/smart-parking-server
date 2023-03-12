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

async function ledStatus(req,res){
    try{
        const parkingSpots = await parkingRepository.getSpots();
        console.log(parkingSpots.rows)
        let leds = ""
        parkingSpots.rows.forEach((spot)=>{
            leds+=(spot.reserved || spot.ocupied)?"1":"0"
        })
        console.log(leds)
        return res.status(200).send(leds)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function sensorsStatus(req,res){
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
        return res.status(200).send(parkingSpotsUpdated.rows)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const parkingController = {getSpots,ledStatus,sensorsStatus}