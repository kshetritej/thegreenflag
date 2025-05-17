import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { action } = await request.json();

    if (!id || !action) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let updateData = {};

    if (action === "suspend") {
      updateData = { suspended: true };
    } else if (action === "unsuspend") {
      updateData = { suspended: false };
    } else {
      return new NextResponse("Invalid action", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 