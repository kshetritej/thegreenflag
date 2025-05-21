"use client";

import PostCard from "@/components/molecules/post-card";
import { Button } from "@/components/ui/button";
import { Post } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Community() {
  const user = useSession().data?.user
  const { data: posts } = useQuery({
    queryKey: ['getPosts'],
    queryFn: async () => await axios.get("/api/post/")
  })

  const router = useRouter()

  return (
    <div className="container mx-auto py-8 space-y-6 px-[10%] min-h-[60vh]">
      <div className="flex justify-between items-start ">
        <div>
          <h1 className="text-4xl font-bold">Community Discussions</h1>
          <p className="text-muted-foreground mt-2">Discussion about the local business among the visitors like you</p>
        </div>
        {
          user &&
          <Button size={'lg'} onClick={() => router.push("/community/create")}>Create Post</Button>
        }
      </div>
      {posts?.data && posts?.data?.length > 0 &&
        posts?.data?.map((post: Post) =>
          <div
            key={post.id}
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <PostCard
              title={post.title}
              content={post.content}
              // @ts-expect-error comment may not exist
              comments={post?.comments?.length}
              // @ts-expect-error author may not exist
              author={post?.author?.username}
              createdAt={post.createdAt}
            />
          </div>
        )
      }
    </div>
  )
}
