// tests/PostForm.test.tsx

// 1) inline-мок ДО будь-яких імпортів:
jest.mock("../store/thunks", () => {
  const original = jest.requireActual("../store/thunks");
  return {
    __esModule: true,
    ...original,
    // замінюємо тільки createPost на jest.fn
    createPost: Object.assign(
      jest.fn((data) => {
        // цей thunk виконається під dispatch(...)
        return async (_dispatch: any) => {
          const result = {
            id: "mock-id",
            ...data,
            uid: "mock-user-id",
            author: "Test User",
          };
          return {
            ...result,
            unwrap: async () => result,
          };
        };
      }),
      {
        type: "posts/create",
        fulfilled: { type: "posts/create/fulfilled" },
      }
    ),
  };
});

// 2) Тепер імпорти (після мок):
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../store/postsSlice";
import { PostForm } from "../components/PostForm";
import { createPost } from "../store/thunks"; // ← це зараз jest.fn!

// 3) Тестовий стор:
const createTestStore = () =>
  configureStore({
    reducer: { posts: postsReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

describe("PostForm", () => {
  const renderWithStore = () =>
    render(
      <Provider store={createTestStore()}>
        <PostForm />
      </Provider>
    );

  it("renders and submits the form", async () => {
    renderWithStore();

    // заповнюємо поля:
    fireEvent.change(screen.getByPlaceholderText("Enter a title"), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the post text"), {
      target: { value: "Test content here" },
    });

    // клікаємо submit
    fireEvent.click(screen.getByRole("button", { name: /create post/i }));

    // чекаємо, що інпути очистяться
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter a title")).toHaveValue("");
      expect(screen.getByPlaceholderText("Enter the post text")).toHaveValue(
        ""
      );
    });

    // перевіряємо, що mock createPost був викликаний
    expect(createPost).toHaveBeenCalledWith({
      title: "Test Title",
      content: "Test content here",
    });
  });

  it("shows validation error if fields empty", async () => {
    renderWithStore();
    fireEvent.click(screen.getByRole("button", { name: /create post/i }));
    expect(
      await screen.findByText(/at least 3 characters/i)
    ).toBeInTheDocument();
  });
});
