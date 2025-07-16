import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import { useTranslations, useFormatter } from 'next-intl';


export function TicketCommentList({ ticketId, editable }: { ticketId: string; editable?: boolean }) {
  const t = useTranslations('TicketCommentList');
  const format = useFormatter();
  const { data: comments, isPending, error, refetch } = api.ticket.getComments.useQuery({ ticketId });
  const addComment = api.ticket.addComment.useMutation({
    onSuccess: () => {
      setValue("");
      toast.success(t('toast.success'));
      void refetch();
    },
  });
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!value.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addComment.mutateAsync({ ticketId, content: value });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      setSubmitError(t('error.addFailed'));
    }
    setSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void handleAdd();
    }
  };

  if (isPending) return <div>{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error.loadFailed')}</div>;

  return (
    <div className="space-y-4">
      {comments.length === 0 && <div className="text-muted-foreground">{t('empty')}</div>}
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 items-start border-b pb-3 last:border-b-0">
          <UserAvatar user={{ image: comment.author.image, name: comment.author.name ?? undefined }} />
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{comment.author.name ?? t('unknown')}</span>
              <span>•</span>
              <span>{format.dateTime(new Date(comment.createdAt), 'fullShort')}</span>
              {comment.isInternal && <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">{t('internal')}</span>}
            </div>
            <div className="mt-1 whitespace-pre-line">{comment.content}</div>
          </div>
        </div>
      ))}
      {editable && (
        <div className="mt-2 flex flex-col gap-2">
          <Textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={t('form.placeholder')}
            disabled={submitting}
            onKeyDown={handleKeyDown}
          />
          {submitError && <div className="text-red-500 text-xs">{submitError}</div>}
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={submitting || !value.trim()}
              size="sm"
              onClick={e => {
                e.preventDefault();
                void handleAdd();
              }}
            >
              {submitting ? t('form.adding') : t('form.add')}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">{t('form.hint')}</div>
        </div>
      )}
    </div>
  );
} 