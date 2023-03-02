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
        console.log(emailExists.rows);
        return res.send("ok");

    }catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}

async function signIn(req,res){
    const {email,password} = req.body;
    try{
        const emailExists = await userRepository.checkEmailExists(email);

        if(!emailExists.rowCount) return res.status(404).send("Email ou senha incorretos");
        if(!bcrypt.compareSync(password, emailExists.rows[0].password)) return res.status(404).send("Email ou senha incorretos");
        const userId = emailExists.rows[0].id
        await userRepository.deleteUserSession(userId)

        const token = uuid();

        await userRepository.createUserSession(userId,token);
        return res.send({token});

    }catch(e){
        console.log(e);
        return res.sendStatus(500);
    }
}



export const userController = {signUp,signIn}