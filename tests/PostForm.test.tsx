import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../store/postsSlice";
import { PostForm } from "../components/PostForm";
import { PostInput } from "../lib/zodSchemas";

// Create stor
const createTestStore = () =>
  configureStore({
    reducer: {
      posts: postsReducer,
    },
  });

// Тип dispatch
//type AppDispatch = ReturnType<typeof createTestStore>["dispatch"];

// ✅ Mock createPost from thunks
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

  it("renders and submits the form", async () => {
    renderWithStore();

    const titleInput = screen.getByPlaceholderText("Enter a title");
    const contentInput = screen.getByPlaceholderText("Enter the post text");
    const submitBtn = screen.getByRole("button", { name: /create post/i });

    fireEvent.change(titleInput, { target: { value: "Test" } });
    fireEvent.change(contentInput, { target: { value: "Content here" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(contentInput).toHaveValue("");
    });
  });

  it("Shows validation error", async () => {
    renderWithStore();

    fireEvent.click(screen.getByRole("button", { name: /create post/i }));
    expect(
      await screen.findByText(/at least 3 characters/i)
    ).toBeInTheDocument();
  });
});
