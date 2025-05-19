import reducer, {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
} from "../store/postsSlice";
import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import type { AnyAction } from "redux";

// Типизированный state
type RootState = ReturnType<typeof reducer>;
let store: ReturnType<typeof configureTestStore>;

function configureTestStore() {
  return configureStore({
    reducer: { posts: reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
}

type AppDispatch = ThunkDispatch<{ posts: RootState }, undefined, AnyAction>;

// 🔧 Мок firebase/firestore
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(async () => ({
    docs: [
      { id: "1", data: () => ({ title: "A", content: "a", uid: "user1" }) },
      { id: "2", data: () => ({ title: "B", content: "b", uid: "user2" }) },
    ],
  })),
  addDoc: jest.fn(async () => ({ id: "3" })),
  updateDoc: jest.fn(async () => {}),
  deleteDoc: jest.fn(async () => {}),
  doc: jest.fn(),
  getFirestore: jest.fn(),
}));

// ✅ Мок firebase/auth
jest.mock("firebase/auth", () => ({
  getAuth: () => ({
    currentUser: {
      uid: "mock-user-id",
      displayName: "Test User",
    },
  }),
}));

describe("postsSlice", () => {
  beforeEach(() => {
    store = configureTestStore();
  });

  it("fetchPosts fulfilled", async () => {
    await (store.dispatch as AppDispatch)(fetchPosts());
    const state = store.getState().posts;

    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toEqual({
      id: "1",
      title: "A",
      content: "a",
      uid: "user1",
      createdAt: null, // если нет поля
    });
  });

  it("createPost fulfilled", async () => {
    const newPost = {
      title: "C",
      content: "c",
    };

    await (store.dispatch as AppDispatch)(createPost(newPost));
    const state = store.getState().posts;

    expect(state.items[0]).toMatchObject({
      id: "3",
      title: "C",
      content: "c",
      uid: "mock-user-id",
      author: "Test User",
    });
  });

  it("updatePost fulfilled", async () => {
    store.dispatch({
      type: fetchPosts.fulfilled.type,
      payload: [{ id: "1", title: "X", content: "x", uid: "u" }],
    });

    await (store.dispatch as AppDispatch)(
      updatePost({ id: "1", data: { title: "Y", content: "y" } })
    );

    const state = store.getState().posts;
    expect(state.items[0]).toEqual({ id: "1", title: "Y", content: "y" });
  });

  it("deletePost fulfilled", async () => {
    store.dispatch({
      type: fetchPosts.fulfilled.type,
      payload: [{ id: "1", title: "Z", content: "z", uid: "u" }],
    });

    await (store.dispatch as AppDispatch)(deletePost("1"));
    const state = store.getState().posts;

    expect(state.items).toHaveLength(0);
  });
});
