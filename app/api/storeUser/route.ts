import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { name, email, passwordRaw } = await request.json();

  if (!name || !email || !passwordRaw) {
    return NextResponse.json(
      { message: "Please fill all fields" },
      { status: 400 }
    );
  }

  // Basic validation for email and password

  // Hash the password
  const password = await bcrypt.hash(passwordRaw, 10);

  // Connect to the database
  await connectDB();
  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists or already registerd using the other provider(google)" },
      { status: 400 }
    );
  }

  // Create a new user
  const newUser = new User({ name, email, password });
  await newUser.save();
  console.log(`User created successfully 🥂`);

  return NextResponse.json(
    { message: "User created successfully" },
    { status: 200 }
  );
}
