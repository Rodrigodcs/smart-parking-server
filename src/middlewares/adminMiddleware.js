import { adminRepository } from "../repositories/adminRepository.js";
import * as adminSchemas from "../schemas/adminSchemas.js"

function validateSignInBody(req,res,next){
    const signInValidation = adminSchemas.signInSchema.validate(req.body)
    if(signInValidation.error) return res.status(422).send(signInValidation.error.details[0].message);
    next();
}

function validateTagRegistrationBody(req,res,next){
    const userEmail = adminSchemas.tagRegistrationSchema.validate(req.body)
    if(userEmail.error) return res.status(422).send(userEmail.error.details[0].message);
    next();
}

function validateAddCreditsBody(req,res,next){
    const requestBody = adminSchemas.addCreditSchema.validate(req.body)
    if(requestBody.error) return res.status(422).send(requestBody.error.details[0].message);
    next();
}

async function autenticateAdmin(req,res,next){
    try{
        const { authorization } = req.headers
        const token = authorization?.replace('Bearer ', "")

        const adminSession = await adminRepository.findAdminSession(token)
        if(!adminSession.rowCount) return res.sendStatus(401)

        res.locals.adminId=adminSession.rows[0].adminId
        next()
    }catch(e){
        console.log(e);
        return res.send(e).status(500)
    }
}

export const adminValidator = {validateSignInBody,autenticateAdmin,validateTagRegistrationBody,validateAddCreditsBody}