import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Data } from "@/models/Data";

export async function PUT(req: NextRequest) {
    const {_id , userId , email , password} = await req.json();
    try {
        await connectDB();
        const exist = await Data.findById({_id , userId});
        if(!exist){
            return NextResponse.json({message : "Data is not there"} , {status : 400})
        }
        const updateStatus = await Data.updateOne({_id , userId} , {$set : {email , password}});
        if(updateStatus.modifiedCount > 0){
            return NextResponse.json({message : "Data is updated"} , {status : 200})
        }else{
            return NextResponse.json({message : "Data is not updated"} , {status : 400})
        }

    } catch (error) {
        if(error instanceof Error)
        console.log(error);
    }
}