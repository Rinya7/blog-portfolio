// components/PostList.tsx
"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchPosts } from "../store/postsSlice";

/** Хук debounce */
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function PostList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.posts);

  const [query, setQuery] = useState("");
  // задерживаем query на 300 мс
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Фильтрация — теперь по debouncedQuery
  const filtered = useMemo(() => {
    if (!debouncedQuery) return items;
    const q = debouncedQuery.trim().toLowerCase();
    return items.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
    );
  }, [items, debouncedQuery]);

  if (loading)
    return <div className="text-center py-10 text-gray-500">Завантаження…</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-600">Помилка: {error}</div>
    );

  return (
    <div className="space-y-6">
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Пошук..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <ul className="space-y-6">
        {filtered.length === 0 ? (
          <li className="text-center text-gray-500">Нічого не знайдено</li>
        ) : (
          filtered.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="block bg-white dark:bg-gray-800 shadow hover:shadow-lg rounded-lg overflow-hidden transition"
              >
                <header className="px-6 py-4 border-b dark:border-gray-700">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {post.title}
                  </h2>
                </header>
                <p className="px-6 py-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.content.length > 200
                    ? post.content.slice(0, 200) + "…"
                    : post.content}
                </p>
                <div className="px-6 pb-4">
                  <span className="text-blue-600 hover:underline">
                    Читати далі →
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
