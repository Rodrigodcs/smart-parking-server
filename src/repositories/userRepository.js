import connection from "../database.js";

async function checkEmailExists(email){
    return connection.query("SELECT * FROM users WHERE email=$1",[email])
}

async function createUser(name,email,hashedPassword,car,licensePlate){
    return connection.query(`
        INSERT INTO users (name,email,password,car,"licensePlate",credits) 
        VALUES($1,$2,$3,$4,$5,$6)
    `,[name,email,hashedPassword,car,licensePlate,0])
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

export const userRepository = {checkEmailExists,createUser,createUserSession,deleteUserSession}