import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userRepository } from "../repositories/userRepository.js";

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



export const userController = {signUp,signIn,getInfo}