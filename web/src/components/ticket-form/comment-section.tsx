"use client"
import { useState } from "react";
import { api } from "@/trpc/react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentSection({ ticketId }: { ticketId: string }) {
  const { data: comments, refetch, isLoading } = api.comment.getByTicket.useQuery({ ticketId });
  const addComment = api.comment.add.useMutation({
    onSuccess: () => {
      setContent("");
      refetch();
    },
  });
  const [content, setContent] = useState("");
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <div className="space-y-4 mb-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 items-start border-b pb-2">
              <Avatar src={comment.author?.image} alt={comment.author?.name} />
              <div>
                <div className="font-medium">{comment.author?.name || "Unknown"}</div>
                <div className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</div>
                <div className="mt-1">{comment.content}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">No comments yet.</div>
        )}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (content.trim()) {
            addComment.mutate({ ticketId, content });
          }
        }}
        className="space-y-2"
      >
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button type="submit" disabled={addComment.isLoading || !content.trim()}>
          {addComment.isLoading ? "Adding..." : "Add Comment"}
        </Button>
      </form>
    </div>
  );
}