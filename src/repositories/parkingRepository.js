import connection from "../database.js";

async function getSpots(){
    return connection.query(`SELECT * FROM "parkingSpots" ORDER BY number`)
}

async function setSpot(id,value){
    console.log("entrou")
    return connection.query(`UPDATE "parkingSpots" SET ocupied = $1, reserved=false,"userId"=null WHERE id=$2`,[value,id])
}

export const parkingRepository = {getSpots,setSpot}