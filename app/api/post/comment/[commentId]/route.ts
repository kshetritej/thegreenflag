import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

type Params = Promise<{ commentId: string }>
export async function DELETE(_request: NextRequest, { params}:{params: Params}) {
  const commentId = (await params).commentId;
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  await prisma.comment.delete({
    where: {
      id: commentId
    },
  });

  return NextResponse.json({ message: "Comment removed successfully." });
}
