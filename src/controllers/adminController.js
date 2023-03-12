import { v4 as uuid } from 'uuid';
import { adminRepository } from "../repositories/adminRepository.js";
import { userRepository } from '../repositories/userRepository.js';

let temporaryUserTag = null
let temporaryUserEmail = null
let waitingReading = false
let waitingRegistration = false

let timeout = null

function resetTemporaryInfo(){
    console.log("RESET TEMPORARIO")
    temporaryUserTag = null
    temporaryUserEmail = null
    waitingReading = false
    waitingRegistration = false
    clearTimeout(timeout)
}

async function signIn(req,res){
    const {email,password} = req.body;
    try{
        const emailExists = await adminRepository.checkEmailExists(email);

        if(!emailExists.rowCount) return res.status(404).send("Email ou senha incorretos");

        if(password!==emailExists.rows[0].password) return res.status(404).send("Email ou senha incorretos");

        const adminId = emailExists.rows[0].id
        await adminRepository.deleteAdminSession(adminId)

        const token = uuid();

        await adminRepository.createAdminSession(adminId,token);
        return res.send({adminId:emailExists.rows[0].id, token});

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function tagReader(req,res){
    resetTemporaryInfo()
    waitingReading = true;

    timeout = setTimeout(()=> resetTemporaryInfo(),10000);
    return res.status(200).send("Esperando leitura da tag");
}

async function getUserInfo(req,res){
    const userTag = temporaryUserTag
    console.log(userTag)
    resetTemporaryInfo()
    try{
        const userInfo = await adminRepository.findUser(userTag)
        if(!userInfo.rowCount) return res.status(401).send("Usuário não encontrado");
        
        return res.status(200).send(userInfo.rows[0]);
    }catch(e){
        return res.status(500).send(e)
    }
    
    
}

async function tagRegistration(req,res){
    temporaryUserEmail = req.body.email;
    try{
        const userExists = await userRepository.checkEmailExists(temporaryUserEmail)
        if(!userExists.rowCount) return res.status(401).send("usuário não cadastrado")
        const user = userExists.rows[0]

        if(user.tagId) return res.status(401).send(`Usuário já cadastrado com a tag: ${user.tagId}`)

        resetTemporaryInfo()

        temporaryUserEmail = req.body.email;
        waitingRegistration = true;
        timeout = setTimeout(()=> resetTemporaryInfo(),10000);

        return res.status(200).send("Esperando leitura da tag");
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
}

async function tagReceived(req,res){
    const cardId = req.body
    const userEmail= temporaryUserEmail
    console.log(cardId,userEmail)
    try{
        if(waitingReading){
            resetTemporaryInfo()
            timeout = setTimeout(()=> resetTemporaryInfo(),10000);
            temporaryUserTag = cardId;
            return res.status(200).send("info do user");
        }else if(waitingRegistration){
            const tagAlreadyRegistered = await adminRepository.findUser(cardId)
            if(tagAlreadyRegistered.rowCount) return res.status(409).send("Tag já registrada")

            await adminRepository.registrateUserTag(userEmail,cardId)
            resetTemporaryInfo()
            return res.status(201).send("Registro efetuado com sucesso")
        }
        return res.status(401).send("Faça pedido pelo cliente")
    }catch(e){
        console.log(e)
        return res.status(500).send(e)
    }
}

async function addCredits(req,res){
    const userEmail = req.body.email
    const credits = req.body.value

    try{
        const userExists = await userRepository.checkEmailExists(userEmail)
        if(!userExists.rowCount) return res.status(401).send("usuário não cadastrado")

        await userRepository.addCredits(userEmail,credits)
        
        return res.status(200).send("CREDITOS ADICIONADOS");

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

async function resetDatabase(req,res){
    try{
        await adminRepository.resetDatabase()
        
        return res.status(200).send("DATABASE RESETED");

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}



export const adminController = {signIn,resetDatabase,tagRegistration,tagReader,getUserInfo,tagReceived,addCredits}