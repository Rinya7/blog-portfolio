// app/layout.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "../store";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-900 dark:bg-gray-50">
        <Provider store={store}>
          {" "}
          <UserProvider>
            <Header />
            <main className="container mx-auto p-6 space-y-8">{children}</main>
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}
