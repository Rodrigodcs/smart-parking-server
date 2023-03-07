import connection from "../database.js";

async function getSpots(){
    return connection.query(`SELECT * FROM "parkingSpots" ORDER BY number`)
}

async function getSpot(spotId){
    return connection.query(`SELECT * FROM "parkingSpots" WHERE id=$1`,[spotId])
}

async function setSpot(id,value){
    return connection.query(`UPDATE "parkingSpots" SET ocupied = $1, reserved=false,"userId"=null WHERE id=$2`,[value,id])
}

async function getReservedSpot(userId){
    return connection.query(`SELECT * FROM "parkingSpots" WHERE "userId"=$1`,[userId])
}

async function cancelReservation(spotId){
    return connection.query(`UPDATE "parkingSpots" SET reserved=false,"userId"=null WHERE id=$1`,[spotId])
}

async function makeReservation(spotId,userId){
    return connection.query(`UPDATE "parkingSpots" SET reserved=true,"userId"=$1 WHERE id=$2`,[userId,spotId])
}

export const parkingRepository = {getSpots,getSpot,setSpot,getReservedSpot,cancelReservation,makeReservation}