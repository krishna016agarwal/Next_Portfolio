import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:boolean 
}

const connection:ConnectionObject={};

async function dbConnect():Promise<void>{
    
    if (connection.isConnected) {
        console.log("Database is already connected");
        return;
    }
    try {
     const db = await mongoose.connect(process.env.MONGODB||"");
    connection.isConnected= true;
    console.log("Database connected successfully")

    } catch (error) {
        console.log("Error in Database Connection",error);
     process.exit(1);   
    }
}

export default dbConnect;