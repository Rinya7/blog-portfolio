// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import postsReducer from "./postsSlice";

 
export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

 
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

 
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
