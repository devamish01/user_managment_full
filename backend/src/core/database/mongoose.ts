import { env } from "@/config/index.js";
import { logger } from "@/shared/logger/index.js";
import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        //Connectio Events
        mongoose.connection.on('connected', ()=> {
            logger.info('Mongo DB connected Successfully');
        });
         mongoose.connection.on('error', (err)=> {
            logger.error(`Mongo DB connection error :${err}`);
        });
             mongoose.connection.on('disconnected', ()=> {
            logger.warn(`Mongo DB disconnected`);
        });


        await mongoose.connect(env.MONGODB_URI);

    } catch (error){
        logger.error(`Failed to connect to mongoDB: ${error}`)
        process.exit(1);
    }
};