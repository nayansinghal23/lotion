"use client";
import { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import Markdown from "react-markdown";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AI = () => {
  const [message, setMessage] = useState<{
    value: string;
    isLoading: boolean;
    error: string;
    response: string;
  }>({
    value: "",
    isLoading: false,
    error: "",
    response: "",
  });
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isAuthenticated) return redirect("/");
  }, []);

  const handleSubmit = async () => {
    if (!message.value) return;
    try {
      setMessage({ ...message, isLoading: true, error: "", response: "" });
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message.value }),
      });
      const { result } = await response.json();
      setMessage({
        ...message,
        isLoading: false,
        response: result.choices?.[0]?.message?.content
          ? result.choices?.[0]?.message?.content
          : "No response received.",
      });
    } catch (error) {
      console.log(error);
      setMessage({
        error: "Oops, something went wrong!!!",
        isLoading: false,
        value: "",
        response: "",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 mt-11">
      <p className="p-[7.5px] font-semibold text-xl border-b border-b-black dark:border-b-white fixed top-0 dark:bg-[#1F1F1F] z-[99998] bg-white w-full">
        AI
      </p>
      <div className="p-2 flex flex-col items-center gap-2">
        <h3 className="text-2xl font-semibold">What can I help with?</h3>
        <div className="w-full flex items-center gap-4">
          <Input
            type="text"
            placeholder="Type something..."
            value={message.value}
            disabled={message.isLoading}
            onChange={(e) =>
              setMessage({
                ...message,
                error: "",
                isLoading: false,
                value: e.target.value,
              })
            }
          />
          <Button onClick={handleSubmit} disabled={message.isLoading}>
            Send
          </Button>
        </div>
      </div>
      {message.isLoading ? (
        <p className="px-2 text-center">Searching...</p>
      ) : message.error ? (
        <div className="px-2 flex items-center gap-2 justify-center">
          <X color="red" />
          <p className="text-red-500">{message.error}</p>
        </div>
      ) : (
        <div className="px-2 flex flex-col gap-3">
          <Markdown>{message.response}</Markdown>
        </div>
      )}
    </div>
  );
};

export default AI;
