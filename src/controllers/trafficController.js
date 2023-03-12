import { configRepository } from "../repositories/configRepository.js";
import { parkingRepository } from "../repositories/parkingRepository.js";
import { trafficRepository } from "../repositories/trafficRepository.js";
import { userRepository } from "../repositories/userRepository.js";

async function checkIn(req,res){
    console.log(res.locals.userId)
    const userId = res.locals.userId
    const checkInTime = new Date();
    try{
        //verifica se usuário existe
        const userExists = await userRepository.getInfo(userId)
        if(!userExists.rowCount) return res.status(403).send("USUÁRIO NÃO EXISTE")
        const user = userExists.rows[0]
        console.log(user)

        //verifica se é um usuário que já reservou
        const reservedSpot = await parkingRepository.getReservedSpot(userId)
        if(reservedSpot.rowCount>0) return res.status(200).send("BEM VINDO")

        //verifica se tem créditos positivos
        if(user.credits<=0) return res.status(401).send("CRÉDITOS INSUFICIENTES")
        
        //verifica se usuário não está atualmente no estacionamento
        const alreadyIn = await trafficRepository.getParkedFromId(userId)
        if(alreadyIn.rowCount>0) return res.status(405).send("É PRECISO FAZER CHECK OUT")
        
        //verifica se estacionamento não está lotado
        const config = await configRepository.getConfig()
        const totalSpots = config.rows[0].totalSpots
        console.log(totalSpots)
        const parked = await trafficRepository.getParked()
        if(parked.rowCount>=totalSpots) return res.status(406).send("MAX CAPACITY")

        //adicionar check in de usuário na tabela traffic
        await trafficRepository.userCheckIn(userId,checkInTime)

        //adicionar novo usuário na tabela parked
        await trafficRepository.insertInParked(userId)

        return res.status(200).send(`USUÁRIO ${user.name} FEZ CHECK IN`);
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function checkOut(req,res){
    console.log(res.locals.userId)
    const userId = res.locals.userId
    const checkOutTime = new Date();

    try{
        //verifica se usuário existe
        const userExists = await userRepository.getInfo(userId)
        if(!userExists.rowCount) return res.status(403).send("USUÁRIO NÃO EXISTE")
        const user = userExists.rows[0]
        console.log(user)

        //pegar valor hora de config
        const config = await configRepository.getConfig()
        const price = config.rows[0].value

        //verifica se usuário está no estacionamento
        const currentlyParked = await trafficRepository.getParkedFromId(userId)
        if(!currentlyParked.rowCount) return res.status(405).send("É PRECISO FAZER CHECK IN");

        //pegar último check in desse user
        const lastCheckIn = await trafficRepository.lastCheck(userId)
        if(lastCheckIn.rows[0].checks === "out") return res.status(405).send("É PRECISO FAZER CHECK IN");

        //calcula o valor a pagar
        const checkInTime = lastCheckIn.rows[0].time;
        const minutesUsed = Math.ceil(((checkOutTime-checkInTime)/1000)/60);
        const payment = minutesUsed*price;

        //calcula novos créditos
        const newCredits = user.credits - payment

        //update nos créditos desse user
        await userRepository.updateCredits(userId,newCredits)
        
        //inserir checkout desse user em traffic
        await trafficRepository.userCheckOut(userId,checkOutTime)

        //remover user da table parked
        await trafficRepository.removeFromParked(userId)

        return res.status(200).send(`USUÁRIO ${user.name} FEZ CHECK OUT`)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const trafficController = {checkIn,checkOut}