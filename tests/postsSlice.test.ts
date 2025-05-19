import reducer, {
  fetchPosts,
  updatePost,
  deletePost,
  type Post,
} from "../store/postsSlice";
import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import type { AnyAction } from "redux";

type RootState = ReturnType<typeof reducer>;

let store: ReturnType<typeof configureTestStore>;

function configureTestStore() {
  return configureStore({
    reducer: { posts: reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }), // отключаем ворнинги
  });
}

type AppDispatch = ThunkDispatch<{ posts: RootState }, undefined, AnyAction>;

describe("postsSlice (pure dispatch version)", () => {
  beforeEach(() => {
    store = configureTestStore();
  });

  it("fetchPosts fulfilled", async () => {
    const mockPosts: Post[] = [
      { id: "1", title: "Test A", content: "aaa", uid: "u1" },
      { id: "2", title: "Test B", content: "bbb", uid: "u2" },
    ];

    store.dispatch({
      type: fetchPosts.fulfilled.type,
      payload: mockPosts,
    });

    const state = store.getState().posts;
    expect(state.items).toHaveLength(2);
    expect(state.items[0].title).toBe("Test A");
  });

  it("createPost fulfilled", () => {
    const newPost: Post = {
      id: "3",
      title: "New post",
      content: "Post content",
      uid: "u3",
      author: "Test User",
    };

    store.dispatch({
      type: "posts/create/fulfilled",
      payload: newPost,
    });

    const state = store.getState().posts;
    expect(state.items[0]).toMatchObject({
      id: "3",
      title: "New post",
      uid: "u3",
    });
  });

  it("updatePost fulfilled", () => {
    // начальное состояние
    store.dispatch({
      type: fetchPosts.fulfilled.type,
      payload: [{ id: "1", title: "Old", content: "x", uid: "u1" }],
    });

    // обновляем
    store.dispatch({
      type: updatePost.fulfilled.type,
      payload: { id: "1", title: "Updated", content: "y", uid: "u1" },
    });

    const state = store.getState().posts;
    expect(state.items[0].title).toBe("Updated");
  });

  it("deletePost fulfilled", () => {
    store.dispatch({
      type: fetchPosts.fulfilled.type,
      payload: [{ id: "1", title: "To delete", content: "z", uid: "u1" }],
    });

    store.dispatch({
      type: deletePost.fulfilled.type,
      payload: "1",
    });

    const state = store.getState().posts;
    expect(state.items).toHaveLength(0);
  });
});
