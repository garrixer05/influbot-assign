import { PrismaClient } from "@prisma/client";

let client = null;


/**
 * @returns {PrismaClient}
 */
export const getPrismaClient = ()=>{
    if(client===null){
        client = new PrismaClient();
    }
    return client
}