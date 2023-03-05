import Joi from "joi"

const tagSchema = Joi.string().min(6).required();

export {tagSchema}