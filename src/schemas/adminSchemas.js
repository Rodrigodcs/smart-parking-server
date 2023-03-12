import Joi from "joi"

const signInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const tagRegistrationSchema = Joi.object({
    email: Joi.string().required(),
});

const addCreditSchema = Joi.object({
    email: Joi.string().required(),
    value: Joi.number().positive().min(1).required()
});

export {signInSchema,tagRegistrationSchema,addCreditSchema}