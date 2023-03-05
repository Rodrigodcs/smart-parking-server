import connection from "../database.js";

async function findTag(tagId){
    return connection.query(`SELECT * FROM users WHERE "tagId"=$1`,[tagId])
}

async function getParked(){
    return connection.query(`SELECT * FROM parked`)
}

async function getParkedFromId(userId){
    return connection.query(`SELECT * FROM parked WHERE "userId" = $1`,[userId])
}

async function userCheckIn(userId, time){
    return await connection.query(`INSERT INTO traffic ("userId", time, checks) VALUES ($1,$2,$3)`,[userId, time, "in"]);
}

async function userCheckOut(userId, time){
    return await connection.query(`INSERT INTO traffic ("userId", time, checks) VALUES ($1,$2,$3)`,[userId, time, "out"]);
}

async function insertInParked(userId){
    return await connection.query(`INSERT INTO parked ("userId") VALUES ($1)`,[userId]);
}

async function removeFromParked(userId){
    return await connection.query(`DELETE FROM parked WHERE "userId"=$1`,[userId]);
}

async function lastCheck(userId){
    return await connection.query(`
        SELECT * FROM traffic
        WHERE "userId" = $1
        ORDER BY traffic DESC
        LIMIT 1
    `,[userId])
}

export const trafficRepository = {
    findTag,
    getParked,
    getParkedFromId,
    userCheckIn,
    userCheckOut,
    insertInParked,
    removeFromParked,
    lastCheck
}