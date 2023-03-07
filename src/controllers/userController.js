import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userRepository } from "../repositories/userRepository.js";
import { configRepository } from "../repositories/configRepository.js";
import { parkingRepository } from "../repositories/parkingRepository.js";
import { trafficRepository } from "../repositories/trafficRepository.js";

async function signUp(req,res){
    const {name,email,password,car,licensePlate} = req.body;
    try{
        const emailExists = await userRepository.checkEmailExists(email);
        if(emailExists.rowCount) return res.status(409).send("Email já cadastrado");
        
        const hashedPassword = bcrypt.hashSync(password, 10);
    
        await userRepository.createUser(name,email,hashedPassword,car,licensePlate);

        return res.send("CREATED");

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function signIn(req,res){
    const {email,password} = req.body;
    try{
        const emailExists = await userRepository.checkEmailExists(email);
        console.log(emailExists.rows[0])
        if(!emailExists.rowCount) return res.status(404).send("Email ou senha incorretos");
        if(!bcrypt.compareSync(password, emailExists.rows[0].password)) return res.status(404).send("Email ou senha incorretos");
        
        const userId = emailExists.rows[0].id
        await userRepository.deleteUserSession(userId)

        const token = uuid();

        await userRepository.createUserSession(userId,token);
        console.log(emailExists.rows)
        return res.send({userId:emailExists.rows[0].id, token});

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function getInfo(req,res){
    const id = res.locals.userId
    try{
        const userInfo = await userRepository.getInfo(id);
        return res.send(userInfo.rows[0])
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function makeReservation(req,res){
    const spotId = req.params.spotId
    const userId = res.locals.userId
    const checkInTime = new Date();
    try{
        console.log("userId:",userId)
        console.log("spotId:",spotId)

        //verifica se usuário existe
        const userExists = await userRepository.getInfo(userId)
        if(!userExists.rowCount) return res.status(401).send("USUÁRIO NÃO EXISTE")
        const user = userExists.rows[0]
        console.log(user)

        //verificar se vaga já não está reservada
        const spotToReserve = await parkingRepository.getSpot(spotId)
        console.log(spotToReserve.rows[0])
        const spot = spotToReserve.rows[0]
        //vaga existe?
        if(!spotToReserve.rowCount) return res.status(401).send("VAGA NÃO ENCONTRADA")
        //já reservada em seu nome?
        if(spot.userId==userId) return res.status(401).send("VAGA JÁ RESERVADA EM SEU NOME")
        //reservada em nome de outro?
        if(spot.userId) return res.status(401).send("VAGA JÁ RESERVADA EM NOME DE OUTRO USUÁRIO")
        
        //verifica se tem créditos positivos
        if(user.credits<=0) return res.status(401).send("CRÉDITOS INSUFICIENTES")

        //verifica se estacionamento não está lotado
        const config = await configRepository.getConfig()
        const totalSpots = config.rows[0].totalSpots
        console.log(totalSpots)
        const parked = await trafficRepository.getParked()
        if(parked.rowCount>=totalSpots) return res.status(401).send("MAX CAPACITY")

        //verifica se usuário já não tem alguma vaga reservada em seu nome
        const userReservedSpot = await parkingRepository.getReservedSpot(userId)
        const userSpot = userReservedSpot.rows[0]
        console.log(userSpot)

        //já tem reserva
        if(userReservedSpot.rowCount){
            //Cancela essa reserva
            await parkingRepository.cancelReservation(userSpot.id)
            //Efetua nova reserva
            await parkingRepository.makeReservation(spotId,userId)

            return res.status(200).send(`USUÁRIO ${user.name} MUDOU RESERVA`);
        } 

        //Efetuar reserva
        await parkingRepository.makeReservation(spotId,userId)

        //fazer checkin
        await trafficRepository.userCheckIn(userId,checkInTime)

        //adicionar novo usuário na tabela parked
        await trafficRepository.insertInParked(userId)

        return res.status(200).send(`USUÁRIO ${user.name} FEZ RESERVA`);

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function cancelReservation(req,res){
    const userId = res.locals.userId
    console.log("userId:",userId)
    const checkOutTime = new Date();
    try{

        //verifica se usuário existe
        const userExists = await userRepository.getInfo(userId)
        if(!userExists.rowCount) return res.status(401).send("USUÁRIO NÃO EXISTE")
        const user = userExists.rows[0]
        console.log("teste",user)

        //pegar valor hora de config
        const config = await configRepository.getConfig()
        const price = config.rows[0].value
        console.log("0")
        //verifica se usuário está no estacionamento
        const currentlyParked = await trafficRepository.getParkedFromId(userId)
        if(!currentlyParked.rowCount) return res.status(402).send("É PRECISO FAZER CHECK IN");
        console.log("1")
        //pegar último check in desse user
        const lastCheckIn = await trafficRepository.lastCheck(userId)
        if(lastCheckIn.rows[0].checks === "out") return res.status(403).send("É PRECISO FAZER CHECK IN");

        //calcula o valor a pagar
        const checkInTime = lastCheckIn.rows[0].time;
        const minutesUsed = Math.ceil(((checkOutTime-checkInTime)/1000)/60);
        const payment = minutesUsed*price;

        //calcula novos créditos
        const newCredits = user.credits - payment

        //verifica se usuário já não tem alguma vaga reservada em seu nome
        const userReservedSpot = await parkingRepository.getReservedSpot(userId)
        const userSpot = userReservedSpot.rows[0]
        console.log(userSpot)

        //remover reserva desse usuário
        await parkingRepository.cancelReservation(userSpot.id)

        //update nos créditos desse user
        await userRepository.updateCredits(userId,newCredits)
        
        //inserir checkout desse user em traffic
        await trafficRepository.userCheckOut(userId,checkOutTime)

        //remover user da table parked
        await trafficRepository.removeFromParked(userId)

        return res.status(200).send(`USUÁRIO ${user.name} CANCELOU A RESERVA`)
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}



export const userController = {signUp,signIn,getInfo,makeReservation,cancelReservation}