import connection from "../database.js";

async function getSpots(){
    return connection.query(`SELECT * FROM "parkingSpots"`)
}

export const parkingRepository = {getSpots}