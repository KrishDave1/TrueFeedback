import mongoose from "mongoose";
import { number } from "zod";

type ConnectionObject = {
    isConnected?: number; // '?' means it is optional
}

const connection: ConnectionObject = {}; // Just a reminder the Typescript object syntax is connection is name and ConnectionObject is type written after colon.

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to the database");
        
        
    }
    catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
}

export default dbConnect;