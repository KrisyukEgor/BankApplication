import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { Header } from "./components/layout/Header";

export function App() {
  return (
    <BrowserRouter>
      <>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          <AppRouter />
        </main>
      </>
    </BrowserRouter>
  );
}