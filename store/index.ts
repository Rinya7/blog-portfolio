// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import postsReducer from "./postsSlice";

// Собираем стор
export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

// Типы для dispatch и selector в компонентах
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Хуки-обёртки
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
