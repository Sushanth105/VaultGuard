import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Data } from "@/models/Data";

export async function DELETE(req : NextRequest){
    const {_id , userId} = await req.json();
    try{
        await connectDB();
        const isThere = await Data.findOne({_id , userId});
        if(!isThere){
            return NextResponse.json({message : "The data is not exist"} , {status : 404});
        }
        await Data.deleteOne({_id , userId});
        return NextResponse.json({message : "The data is deleted"} , {status : 200});

    }
    catch(err){
        console.log(err);
        return NextResponse.json({message : "Something went wrong"} , {status : 500});
    }
}