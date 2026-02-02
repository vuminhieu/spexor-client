import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useTheme } from "../context/theme-context";

interface GreetResponse {
  message: string;
  timestamp: string;
}

export function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGreet = async () => {
    setLoading(true);
    try {
      const response = await invoke<GreetResponse>("greet", { name: "Spexor User" });
      setGreeting(response.message);
    } catch (error) {
      setGreeting(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Spexor Client
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          React + Rust powered by Tauri v2
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={toggleTheme} variant="secondary">
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
        <Button onClick={handleGreet} disabled={loading}>
          {loading ? "Loading..." : "🚀 Test Tauri Command"}
        </Button>
      </div>

      {greeting && (
        <Card className="max-w-md text-center">
          <p className="text-green-600 dark:text-green-400 font-medium">{greeting}</p>
        </Card>
      )}

      <Card className="max-w-lg text-center">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          🎉 Framework Setup Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your Tauri v2 project is ready. Start building amazing desktop apps!
        </p>
      </Card>
    </div>
  );
}
