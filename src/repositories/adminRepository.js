import connection from "../database.js";

async function checkEmailExists(email){
    return connection.query("SELECT * FROM admins WHERE email=$1",[email])
}

async function createAdminSession(id,token){
    return connection.query(`
        INSERT INTO "sessionsAdmins" ("adminId",token) 
        VALUES($1,$2)
    `,[id,token])
}

async function deleteAdminSession(id){
    return connection.query(`
        DELETE FROM "sessionsAdmins"
        WHERE "adminId"=$1
    `,[id])
}

export const adminRepository = {checkEmailExists,createAdminSession,deleteAdminSession}