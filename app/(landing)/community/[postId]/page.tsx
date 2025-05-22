"use client";

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Trash, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentForm } from "@/components/organisms/comment-form"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import MyToolTip from "@/components/atoms/MyTooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useState } from "react";
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

export default function PostPage() {
  const { postId } = useParams()
  const session = useSession()
  const user = session.data?.user
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: post } = useQuery({
    queryFn: async () => await axios.get(`/api/post/${postId}`),
    queryKey: ['getPost', postId]
  })

  const { mutate: deleteComment } = useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: async (commentId: string) => await axios.delete(`/api/post/comment/${commentId}`),
    onSuccess: () => {
      toast.success("Comment deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['getPost', postId] })
    },
    onError: () => toast.error("Failed to delete comment")
  })

  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/post/${postId}`)
    },
    onSuccess: () => {
      toast.success("Post deleted successfully")
      // Redirect to community page after deletion
      router.push("/community")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete post")
    }
  })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const { mutate: updatePost, isPending: isUpdating } = useMutation({
    mutationFn: async (data: { title: string, content: string }) => {
      await axios.patch(`/api/post/${postId}`, data)
    },
    onSuccess: () => {
      toast.success("Post updated successfully")
      setShowEditDialog(false)
      queryClient.invalidateQueries({ queryKey: ['getPost', postId] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update post")
    }
  })

  function handleEditPost() {
    setEditTitle(post?.data.title)
    setEditContent(post?.data.content)
    setShowEditDialog(true)
  }

  function handleSaveEdit() {
    updatePost({ title: editTitle, content: editContent })
  }

  if (!post?.data) {
    return (
      <div className="container py-8 px-4 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Button asChild>
            <Link href="/community">Back to Community</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container min-w-3xl max-w-3xl  py-8 px-4 mx-auto">
      <div className="flex flex-col gap-6  mx-auto">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/community" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Community
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{post.data.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.data.author.profileImage} alt={post.data.author.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{post.data.author.name}</span>
                <span className="text-sm text-muted-foreground">
                  • {formatDistanceToNow(post.data.createdAt, { addSuffix: true })}
                </span>
                {/* Post owner controls */}
                {/* @ts-expect-error: user.id is injected by next-auth session callback */}
                {user && user.id === post.data.author.id && (
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleEditPost}>
                      Edit
                    </Button>
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { setShowDeleteDialog(false); deletePost(); }}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{post.data.content}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Comments ({post.data.comments.length})</h2>

          {post.data.comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No comments yet. Be the first to comment!</p>
              <CommentForm postId={post.data.id} />
            </div>
          ) : (
            <div className="space-y-4">
                <CommentForm postId={post.data.id} />
                {post.data.comments.map((comment: any) => (
                <Card key={comment.id}>
                    <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        {comment?.author?.profileImage &&
                          <AvatarImage src={comment?.author?.profileImage} alt={comment.author.name || ""} />
                        }
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment?.author?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        • {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    </CardHeader>
                    {/* @ts-expect-error it exists */}
                    {comment.author.id === user?.id && (
                      <CardFooter>
                        <MyToolTip content="Clicking this button will immediately delete this comment.">
                          <Button size={'default'} variant={'destructive'} onClick={() => deleteComment(comment.id)}><Trash /> Delete</Button>
                        </MyToolTip>
                      </CardFooter>
                    )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Post</AlertDialogTitle>
            <AlertDialogDescription>
              Update your post details below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Input value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Title" />
            <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} placeholder="Content" className="min-h-[100px]" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isUpdating} onClick={handleSaveEdit}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
