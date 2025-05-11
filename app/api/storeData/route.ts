import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Data } from "@/models/Data";

export const POST = async (req: NextRequest) => {
  const { userId, url, email, rowPassword } = await req.json();
  if (!userId || !url || !email || !rowPassword) {
    return NextResponse.json({ message: "All fields are required" });
  }
  const exist = await Data.findOne({ $and: [{ userId }, { url }, { email }] });
  if (exist) {
    return NextResponse.json({ message: "Data already exists" });
  }
  await connectDB();
  try {
    const data = new Data({
      url,
      email,
      password: rowPassword,
      userId,
    });
    await data.save();
    return NextResponse.json({ message: "Data stored successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message });
    }
    return NextResponse.json({ message: "Error in storing data" });
  }
};
