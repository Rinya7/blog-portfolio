# My Blog

Односторінковий застосунок-блог на Next.js 13 (App Router) + Redux Toolkit + TypeScript + Firebase Firestore + Zod + Tailwind CSS.

## 🚀 Старт проєкту

1. **Клонувати репозиторій**

   ```bash
   git clone https://github.com/ВАШ_ЛОГІН/my-blog.git
   cd my-blog
   ```

2. **Встановити залежності**

   ```bash
   npm install
   ```

3. **Створити файл `.env.local`** у корені проєкту:

   ```dotenv
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

4. **Увімкнути Firestore у Firebase Console** (режим Test) та встановити правила:

   ```js
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

5. **Запуск у режимі розробки**

   ```bash
   npm run dev
   ```

   Відкрити в браузері: http://localhost:3000

6. **Білд і продакшен**
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Структура проєкту

```
my-blog/
├── .env.local
├── README.md
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
│
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/
│   │           ├── route.ts
│   │           └── comments/
│   │               └── route.ts
│   └── posts/
│       ├── [id]/
│       │   ├── page.tsx
│       │   ├── loading.tsx
│       │   └── edit/
│       │       └── page.tsx
│       └── page.tsx
│
├── components/
│   ├── PostForm.tsx
│   ├── PostList.tsx
│   ├── DeletePostButton.tsx
│   ├── EditPostForm.tsx
│   ├── CommentsList.tsx
│   └── CommentsForm.tsx
│
├── lib/
│   ├── firebase.ts
│   └── zodSchemas.ts
│
├── store/
│   ├── index.ts
│   └── postsSlice.ts
│
└── tests/
    ├── postsSlice.test.ts
    └── PostForm.test.tsx
```

---

## 📖 Опис основних частин

- **`app/page.tsx`** — головна сторінка, рендерить `PostForm` і `PostList`.
- **`app/posts/[id]/page.tsx`** — сторінка окремого поста (SSR).
- **`components/PostForm.tsx`** — форма створення поста.
- **`components/PostList.tsx`** — список постів, пошук, пагінація.
- **`components/EditPostForm.tsx`** — редагування поста.
- **`components/DeletePostButton.tsx`** — кнопка видалення.
- **`components/CommentsList.tsx`** — список коментарів.
- **`components/CommentsForm.tsx`** — форма коментарів.
- **API**: `route.ts` всередині `app/api/posts/...`
- **Store**: `store/postsSlice.ts` містить основні Redux-операції.
- **Zod**: `lib/zodSchemas.ts` для валідації форм.
- **Firebase**: `lib/firebase.ts`

---

## 🧪 Тестування

- `tests/postsSlice.test.ts` — тести для Redux slice.
- `tests/PostForm.test.tsx` — тести для форми.

---

## 🚀 Деплой

Рекомендовано використовувати **Vercel**:

1. Підключити Git-репозиторій.
2. Додати змінні оточення у Dashboard.
3. Натиснути **Deploy**.

---

## ✅ Стан реалізації

| Вимога / Функціональність                            | Статус |
| ---------------------------------------------------- | :----: |
| **База даних Firestore**                             |   ✅   |
| **Redux Toolkit + TypeScript**                       |   ✅   |
| **Zod-валидація (форма + API)**                      |   ✅   |
| **SSR (App Router)**                                 |   ✅   |
| **Tailwind CSS**                                     |   ✅   |
| **Список постів, створення, редагування, видалення** |   ✅   |
| **Коментарі до постів**                              |   ✅   |
| **Пошук і пагінація**                                |  ✅/○  |
| **Документація (README)**                            |   ✅   |
| **Модульні тести**                                   |   ○    |
