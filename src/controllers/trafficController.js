import { trafficRepository } from "../repositories/trafficRepository.js";

async function checkIn(req,res){
    try{
        console.log(res.locals.userId)
        return res.send("ok")
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const trafficController = {checkIn}