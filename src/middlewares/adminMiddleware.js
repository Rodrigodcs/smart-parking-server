import * as adminSchemas from "../schemas/adminSchemas.js"

function validateSignInBody(req,res,next){
    const signInValidation = adminSchemas.signInSchema.validate(req.body)
    if(signInValidation.error) return res.status(422).send(signInValidation.error.details[0].message);
    next();
}

export const adminValidator = {validateSignInBody}