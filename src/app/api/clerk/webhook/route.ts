'use server';

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { WebhookEvent } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WebhookEvent;
    const eventType = body.type;

    console.log("Body:", body);

    // Check if the event type is 'user.created'
    if (eventType !== "user.created") {
      console.log("Event type not 'user.created'. Ignoring...");
      return NextResponse.json({ message: "Ignored" }, { status: 404 });
    }

    // Check if the user already exists in the database
    const userExist = await prisma.user.findFirst({
      where: { id: body.data.id },
    });

    console.log("Checking if user exists...");

    if (userExist) {
      console.log("User already exists:", userExist);
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    console.log("User doesn't exist. Creating user...");

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        id: body.data.id,
        username: body.data.username ?? body.data.email_addresses[0].email_address.split("@")[0],
        email: body.data.email_addresses[0].email_address,
        name: body.data.first_name + " " + body.data.last_name,
        image: body.data.image_url,
      },
    });

    console.log("User created successfully:", user);

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
