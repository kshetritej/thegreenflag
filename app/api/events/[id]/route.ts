import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/prisma/prismaClient";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}


type Params = Promise<{ id: string }>
export async function GET(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = session.user as SessionUser;

    const event = await prisma.event.findUnique({
      where: {
        id: (await params).id,
        userId: user.id,
      },
      include: {
        business: true,
        user: true,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = session.user as SessionUser;

    const body = await request.json();
    const { title, description, startDate, endDate, businessId } = body;

    if (!title || !startDate || !endDate || !businessId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        ownerId: user.id,
      },
    });

    if (!business) {
      return new NextResponse("Business not found or unauthorized", { status: 404 });
    }

    const existingEvent = await prisma.event.findUnique({
      where: {
        id: (await params).id,
        userId: user.id,
      },
    });

    if (!existingEvent) {
      return new NextResponse("Event not found", { status: 404 });
    }

    const event = await prisma.event.update({
      where: {
        id: (await params).id,
        userId: user.id,
      },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        businessId,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = session.user as SessionUser;

    const event = await prisma.event.findUnique({
      where: {
        id: (await params).id,
        userId: user.id,
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    await prisma.event.delete({
      where: {
        id: (await params).id,
        userId: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EVENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 