// components/EditPostForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostInput, PostInputSchema } from "@/lib/zodSchemas";
import { useAppDispatch } from "@/store";
import { updatePost } from "@/store/postsSlice";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  initialTitle: string;
  initialContent: string;
}

export default function EditPostForm({
  id,
  initialTitle,
  initialContent,
}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostInputSchema),
    defaultValues: { title: initialTitle, content: initialContent },
  });

  const onSubmit = async (values: PostInput) => {
    setErrorMsg(null);
    try {
      await dispatch(updatePost({ id, data: values })).unwrap();
      router.push(`/posts/${id}`);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Ошибка при обновлении");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <div>
        <label className="block mb-1">Заголовок</label>
        <input {...register("title")} className="w-full p-2 border rounded" />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Зміст</label>
        <textarea
          {...register("content")}
          rows={6}
          className="w-full p-2 border rounded"
        />
        {errors.content && (
          <p className="text-red-600">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {isSubmitting ? "Зберігаю…" : "Зберегти"}
      </button>
    </form>
  );
}
