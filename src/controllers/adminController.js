import { v4 as uuid } from 'uuid';
import { adminRepository } from "../repositories/adminRepository.js";


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
        return res.send({token});

    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const adminController = {signIn}