// lib/zodSchemas.ts
import { z } from "zod";

/**
 * Input verification scheme when creating/updating a post
 */
export const PostInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
});

// Тип для TS
export type PostInput = z.infer<typeof PostInputSchema>;

export const CommentSchema = z.object({
  author: z
    .string()
    .min(1, "Please enter your name")
    .max(50, "Name must be at most 50 characters"),
  text: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be at most 500 characters"),
});
export type CommentInput = z.infer<typeof CommentSchema>;
