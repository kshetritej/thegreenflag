"use client";

import Info from '@/components/atoms/info-modal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { Router } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token');
  const email = params.get('email');

  const [tokenIsValid, setTokenIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const router = useRouter();

  console.log("password", password);
  console.log("email:", email);

  const { mutate } = useMutation({
    mutationFn: async () => {
      console.log("sending request with email and passwrd: ", email, password)
      const res = await fetch(`/api/settings/change-password/forget`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: password, email: email }),
      });

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      return res.json();
    },
    onSuccess: () => {
      setError(null);
      router.push("/login");
      return toast.success("Password reset successfully. You can now login with your new password.");
    },
    onError: (error) => {
      setError(error.message);
    },
  })

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError("Invalid token or email");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/token?tk=${token}`, { method: "POST" });
        const data = await res.json();

        if (res.ok && data.message === "Token is valid") {
          setTokenIsValid(true);
        } else {
          setError(data.error || "Token is invalid or expired.");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setError("An error occurred during token verification.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();

  }, [token, email]); // Add token and email to the dependency array

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <Card className="w-full max-w-sm mx-auto mt-10 p-4">
          <p>Verifying token...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <Card className="w-full max-w-sm mx-auto mt-10 p-4">
          <h1 className='text-2xl font-bold text-red-400'>Error</h1>
          <p>{error}</p>
          {error.includes("expired") && <p>Please request a new password reset link.</p>}
        </Card>
      </div>
    );
  }

  if (!tokenIsValid) {
    // This case should be covered by the error state, but keeping it
    // explicitly for clarity or if you have different invalid states
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <Card className="w-full max-w-sm mx-auto mt-10">
          <h1>Invalid token</h1>
          <p>Please request a new password reset link.</p>
        </Card>
      </div>
    )
  }


  return (
    <form className='flex flex-col items-center justify-center min-h-screen' onSubmit={(e) => { e.preventDefault(); mutate() }}>
      <Card className="w-full max-w-sm mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        {
          password && confirmPassword &&
          <Info message={passwordMatch ? "Okay" : "Password doesn't match"} className={passwordMatch ? "border-green-500 bg-green-50" : ""} />
        }
        <Label>New Password</Label>
        <Input type='password' placeholder='Enter new password' required onChange={(e) => setPassword(e.target.value)} />
        <Label>Confirm Password</Label>
        <Input type='password' placeholder='Confirm new password' required onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button disabled={!passwordMatch} type="submit">Change Password</Button>
      </Card>
    </form>
  );
}