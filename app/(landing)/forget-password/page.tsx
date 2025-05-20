"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const sendEmail = async (email: string) => await fetch("/api/forget-password", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email: email })
});

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Card className="w-full max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to reset your password
        </p>
        <form onSubmit={(e) =>{e.preventDefault(); sendEmail(email).then(res => {
          if (res.ok) {
            setError(null);
            toast.success("Email sent successfully. Check your inbox.");
            setEmail("");
          } else {
            setError("Failed to send email");
          }
        })}} className="flex flex-col gap-4 mt-4">
          {error && <p className="text-red-500">{error}</p>}
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-fit">Submit</Button>
        </form>
      </Card>
    </div>
  )
}