import * as trafficSchemas from "../schemas/trafficSchemas.js"
import { trafficRepository } from "../repositories/trafficRepository.js";

async function tagValidator(req,res,next){
    try{
        const tagId = req.body
        const tagValidation = trafficSchemas.tagSchema.validate(tagId)
        if(tagValidation.error) return res.status(422).send(tagValidation.error.details[0].message);
        const tagExists = await trafficRepository.findTag(tagId)
        if(!tagExists.rowCount) return res.status(404).send("TAG NÃO CADASTRADA")
        res.locals.userId=tagExists.rows[0].id
        next()
    }catch(e){
        console.log(e);
        return res.send(e).status(500);
    }
}

export const trafficValidator = {tagValidator}