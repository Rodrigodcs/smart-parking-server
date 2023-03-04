import * as userSchemas from "../schemas/userSchemas.js"
import { userRepository } from "../repositories/userRepository.js";

function validateSignUpBody(req,res,next){
    const signUpValidation = userSchemas.signUpSchema.validate(req.body)
    if(signUpValidation.error) return res.status(422).send(signUpValidation.error.details[0].message);
    next();
}

function validateSignInBody(req,res,next){
    const signInValidation = userSchemas.signInSchema.validate(req.body)
    if(signInValidation.error) return res.status(422).send(signInValidation.error.details[0].message);
    next();
}

async function autenticateUser(req,res,next){
    console.log(req.headers.authorization)
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', "")
    const userSession = await userRepository.findUserSession(token)
    if(!userSession.rowCount) return res.sendStatus(401)
    res.locals.userId=userSession.rows[0].userId
    next()
}

export const userValidator = {validateSignUpBody,validateSignInBody,autenticateUser}

