import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const body = await request.json();
        const userData = body.formData;
        
        if (!userData.name || !userData.email || !userData.password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const duplicate = await User.findOne({ email: userData.email });
        if (duplicate) {
            return NextResponse.json({ message: "User error" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        await User.create(userData);
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}