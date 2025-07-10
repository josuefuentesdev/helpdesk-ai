"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { UserGetOne } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseFormSchema, type UserFormValues } from "../user-form/user-form-schemas";
import { LocaleFormField } from "../locale-form-field";
import { DepartmentFormField } from "../department-form-field";

interface ProfileEditFormProps {
  user: UserGetOne;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const t = useTranslations("ProfileEditForm");
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      locale: user?.locale ?? "en",
      departmentId: user?.departmentId ?? undefined,
    },
  });

  const mutation = api.user.updateOne.useMutation({
    onSuccess: () => {
      toast.success(t("toast.success"));
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error(t("toast.error"));
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          mutation.mutate({ ...values, id: user.id })
        )}
        className="space-y-6"
      >
        <LocaleFormField control={form.control} name="locale" />
        <DepartmentFormField control={form.control} name="departmentId" />
        <Button type="submit" className="min-w-[120px]">
          {form.formState.isSubmitting ? t("button.saving") : t("button.save")}
        </Button>
      </form>
    </Form>
  );
}
