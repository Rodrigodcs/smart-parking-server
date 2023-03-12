import {tagIdSchema} from "../schemas/tagSchema.js";

function tagValidatorSchema(req,res,next) {
    const bodyValidation = tagIdSchema.validate(req.body);
    if(bodyValidation.error) return res.status(422).send(bodyValidation.error.details[0].message);
    next();
}

export const tagValidator = {tagValidatorSchema}