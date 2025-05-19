// jest.setup.ts
import dotenv from "dotenv";

// Загружаем .env.test только для тестов
dotenv.config({ path: ".env.test" });
