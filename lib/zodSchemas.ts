// lib/zodSchemas.ts
import { z } from "zod";

/**
 * Схема проверки ввода при создании/обновлении поста
 */
export const PostInputSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Заголовок мінімум 3 символи" })
    .max(100, { message: "Заголовок до 100 символів" }),
  content: z.string().min(10, { message: "Зміст мінімум 10 символів" }),
});

// Тип для TS
export type PostInput = z.infer<typeof PostInputSchema>;

export const CommentSchema = z.object({
  author: z.string().min(1, "Вкажіть ім'я").max(50),
  text: z.string().min(1, "Коментарій не може бути пустий").max(500),
});
export type CommentInput = z.infer<typeof CommentSchema>;
