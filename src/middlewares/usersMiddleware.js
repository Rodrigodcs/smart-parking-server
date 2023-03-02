import * as userSchemas from "../schemas/userSchemas.js"

function validateSignUpBody(req,res,next){
    console.log(req.body)
    const signUpValidation = userSchemas.signUpSchema.validate(req.body)
    if(signUpValidation.error) return res.status(422).send(signUpValidation.error.details[0].message);
    next();
}

function validateSignInBody(req,res,next){
    console.log(req.body)
    const signInValidation = userSchemas.signInSchema.validate(req.body)
    if(signInValidation.error) return res.status(422).send(signInValidation.error.details[0].message);
    next();
}

export const userValidator = {validateSignUpBody,validateSignInBody}

