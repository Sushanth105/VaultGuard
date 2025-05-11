import { NextRequest , NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Data } from "@/models/Data";

export async function POST(request : NextRequest) {
    const {userId} = await request.json();
    await connectDB();
    const user = await Data.find({userId});
    if (!user) {
        return NextResponse.json({message: "User not found"}, {status: 404});
    }
    return NextResponse.json({data : user}, {status: 200});
}