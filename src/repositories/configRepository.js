import connection from "../database.js";

async function getConfig(){
    return connection.query(`SELECT * FROM config`)
}

export const configRepository = {getConfig}