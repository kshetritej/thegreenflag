import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth/next";


type Params = Promise<{ postId: string }>
export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { postId } = await params
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
    },
  })
  return NextResponse.json(post)
}


export async function POST(request: NextRequest, { params }: { params: Params }) {
  const body = await request.json()
  const { content, authorId } = body
  const { postId } = await params
  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const comment = await prisma.comment.create({
    data: { content, postId: post.id, authorId: authorId },
  })

  return NextResponse.json(comment)
}

// DELETE /api/post/[postId]
export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  const { postId } = await params;
  try {
    // Only allow deleting if the user is the author
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    await prisma.post.delete({ where: { id: postId } });
    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/post/[postId]
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { postId } = await params;
  const body = await req.json();
  const { title, content } = body;
  try {
    // Only allow editing if the user is the author
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });
    return NextResponse.json({ message: "Post updated successfully", post: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Something went wrong" }, { status: 500 });
  }
}
