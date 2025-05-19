import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../store/postsSlice";
import { PostForm } from "../components/PostForm";
import { PostInput } from "../lib/zodSchemas";

// Создаём стор
const createTestStore = () =>
  configureStore({
    reducer: {
      posts: postsReducer,
    },
  });

// Тип dispatch
//type AppDispatch = ReturnType<typeof createTestStore>["dispatch"];

// ✅ Мокаем createPost из thunks без any
jest.mock("../store/thunks", () => {
  const actual = jest.requireActual("../store/thunks");
  return {
    ...actual,
    createPost: Object.assign(
      (data: PostInput) => {
        return {
          type: "posts/create",
          payload: { id: "mock-id", ...data },
          unwrap: async () => ({ id: "mock-id", ...data }),
        };
      },
      {
        type: "posts/create",
        fulfilled: { type: "posts/create/fulfilled" },
      }
    ),
  };
});

describe("PostForm", () => {
  const renderWithStore = () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <PostForm />
      </Provider>
    );

    return store;
  };

  it("рендерить и відправляє форму", async () => {
    renderWithStore();

    const titleInput = screen.getByPlaceholderText("Введіть заголовок");
    const contentInput = screen.getByPlaceholderText("Введіть текст поста");
    const submitBtn = screen.getByRole("button", { name: /створити пост/i });

    fireEvent.change(titleInput, { target: { value: "Test" } });
    fireEvent.change(contentInput, { target: { value: "Content here" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(contentInput).toHaveValue("");
    });
  });

  it("Показує помилку валідації", async () => {
    renderWithStore();

    fireEvent.click(screen.getByRole("button", { name: /створити пост/i }));
    expect(await screen.findByText(/мінімум 3 символи/i)).toBeInTheDocument();
  });
});
