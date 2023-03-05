import connection from "../database.js";

async function getSpots(){
    return connection.query(`SELECT * FROM "parkingSpots" ORDER BY number`)
}

async function setSpot(id,value){
    return connection.query(`UPDATE "parkingSpots" SET ocupied = $1, reserved=false,"userId"=null WHERE id=$2`,[value,id])
}

async function getReservedSpot(userId){
    return connection.query(`SELECT * FROM "parkingSpots" WHERE "userId"=$1`,[userId])
}

export const parkingRepository = {getSpots,setSpot,getReservedSpot}