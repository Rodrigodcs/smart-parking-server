import connection from "../database.js";

async function findTag(tagId){
    return connection.query(`SELECT * FROM users WHERE "tagId"=$1`,[tagId])
}

export const trafficRepository = {findTag}