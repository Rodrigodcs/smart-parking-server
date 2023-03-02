import Joi from "joi"

const signUpSchema = Joi.object({
    name: Joi.string().required(),
    car: Joi.string().required(),
    licensePlate: Joi.string().min(7).max(7).required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
});

const signInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

export {signUpSchema,signInSchema}