import connection from "../database.js";

async function checkEmailExists(email){
    return connection.query("SELECT * FROM users WHERE email=$1",[email])
}

async function createUser(name,email,hashedPassword,car,licensePlate){
    return connection.query(`
        INSERT INTO users (name,email,password,car,"licensePlate",credits) 
        VALUES($1,$2,$3,$4,$5,$6)
    `,[name,email,hashedPassword,car,licensePlate,50])
}

async function createUserSession(id,token){
    return connection.query(`
        INSERT INTO "sessionsUsers" ("userId",token) 
        VALUES($1,$2)
    `,[id,token])
}

async function deleteUserSession(id){
    return connection.query(`
        DELETE FROM "sessionsUsers"
        WHERE "userId"=$1
    `,[id])
}

async function findUserSession(token){
    return connection.query(`
        SELECT * FROM "sessionsUsers"
        WHERE token=$1
    `,[token])
}

async function getInfo(id){
    return connection.query(`
        SELECT email,name,car,"licensePlate",credits,"tagId" FROM users
        WHERE id=$1
    `,[id])
}

async function updateCredits(userId,newCredits){
    await connection.query(`UPDATE users SET credits = $1 WHERE id = $2`,[newCredits,userId])
}

async function addCredits(userEmail,credits){
    await connection.query(`UPDATE users SET credits = credits+$1 WHERE email = $2`,[credits,userEmail])
}

export const userRepository = {
    checkEmailExists,
    createUser,
    createUserSession,
    deleteUserSession,
    findUserSession,
    getInfo,
    updateCredits,
    addCredits
}