// __mocks__/store/thunks.ts
import { PostInput } from "@/lib/zodSchemas";

export const createPost = Object.assign(
  jest.fn((data: PostInput) => {
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
);
