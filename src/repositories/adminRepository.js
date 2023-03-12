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

async function findAdminSession(token){
    return connection.query(`
        SELECT * FROM "sessionsAdmins"
        WHERE token=$1
    `,[token])
}

async function registrateUserTag(userEmail,tag){
    return connection.query(`UPDATE users SET "tagId" = $1 WHERE email = $2`,[tag,userEmail])
}

async function findUser(tag){
    return connection.query(`
        SELECT email,name,car,"licensePlate",credits,"tagId" FROM users
        WHERE "tagId"=$1
    `,[tag])
}

async function resetDatabase(){
    return connection.query(`
        DROP TABLE config;
        DROP TABLE traffic;
        DROP TABLE parked;
        DROP TABLE "sessionsAdmins";
        DROP TABLE "sessionsUsers";
        DROP TABLE "parkingSpots";
        DROP TABLE admins CASCADE;
        DROP TABLE users CASCADE;
        
        CREATE TABLE users(
        id serial,
        "tagId" TEXT UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        car TEXT NOT NULL,
        "licensePlate" TEXT NOT NULL,
        credits INTEGER NOT NULL,
        CONSTRAINT users_pk PRIMARY KEY(id)
        );
        
        CREATE TABLE "sessionsUsers"(
        id serial NOT NULL,
        "userId" integer NOT NULL,
        token TEXT NOT NULL UNIQUE,
        CONSTRAINT "sessionsUsers_pk" PRIMARY KEY(id)
        );
        
        CREATE TABLE admins(
        id serial NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        CONSTRAINT admins_pk PRIMARY KEY(id)
        );
        
        CREATE TABLE "sessionsAdmins"(
        id serial NOT NULL,
        "adminId" integer NOT NULL,
        token TEXT NOT NULL UNIQUE,
        CONSTRAINT "sessionsAdmins_pk" PRIMARY KEY(id)
        );
        
        CREATE TABLE config(
        id serial NOT NULL,
        value integer NOT NULL,
        "totalSpots" integer NOT NULL,
        CONSTRAINT config_pk PRIMARY KEY(id)
        );
        
        CREATE TABLE "parkingSpots"(
        id serial NOT NULL,
        number integer NOT NULL UNIQUE,
        ocupied BOOLEAN NOT NULL,
        reserved BOOLEAN NOT NULL,
        "userId" integer,
        CONSTRAINT "parkingSpots_pk" PRIMARY KEY(id)
        );
        
        CREATE TABLE traffic(
        id serial NOT NULL,
        "userId" integer NOT NULL,
        time TIMESTAMP NOT NULL,
        checks TEXT NOT NULL,
        CONSTRAINT traffic_pk PRIMARY KEY(id)
        );
        
        CREATE TABLE parked(
        id serial NOT NULL,
        "userId" integer NOT NULL,
        CONSTRAINT parked_pk PRIMARY KEY(id)
        );
        
        ALTER TABLE "parkingSpots" ADD CONSTRAINT "parkingSpots_fk0" FOREIGN KEY("userId") REFERENCES users(id);
        
        ALTER TABLE traffic ADD CONSTRAINT traffic_fk0 FOREIGN KEY("userId") REFERENCES users(id);
        
        ALTER TABLE "sessionsUsers" ADD CONSTRAINT "sessionsUsers_fk0" FOREIGN KEY("userId") REFERENCES users(id);
        
        ALTER TABLE "sessionsAdmins" ADD CONSTRAINT "sessionsAdmins_fk0" FOREIGN KEY("adminId") REFERENCES admins(id);
        
        ALTER TABLE parked ADD CONSTRAINT parked_fk0 FOREIGN KEY("userId") REFERENCES users(id);
        
        INSERT INTO admins (email,password) VALUES ('admin@admin.com','123456');
        INSERT INTO "parkingSpots" (number,ocupied,reserved) VALUES (1,false,false);
        INSERT INTO "parkingSpots" (number,ocupied,reserved) VALUES (2,false,false);
        INSERT INTO "parkingSpots" (number,ocupied,reserved) VALUES (3,false,false);
        INSERT INTO "parkingSpots" (number,ocupied,reserved) VALUES (4,false,false);
        INSERT INTO config (value, "totalSpots") VALUES (2,4);
        
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Rodrigo','ro@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Gol','ABC1111',50,'C1F95422');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Marcela','ma@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Etios','ABC2222',50,'C1C2F222');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Leandro','le@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Idea','ABC3333',50,'D113E822');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Ivete','iv@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Equinox','ABC4444',50,'4A10B489');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Matheus','mat@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Corsa','ABC5555',50,'C1E26922');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Gustavo','gus@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Fusca','ABC6666',2,'339795E2');
        INSERT INTO users (name,email,password,car,"licensePlate",credits,"tagId") VALUES('Oscar','os@gmail.com','$2b$10$Rzfy6E78prfZq1ivxi1v6.AfDYegTpYwMUcRlImuDtUvM7cnEakIe','Fusca','ABC7777',-10,'43005B2E');
    `)
}

export const adminRepository = {checkEmailExists,createAdminSession,deleteAdminSession,resetDatabase,findAdminSession,registrateUserTag,findUser}