"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user, login, logout } = useContext(AuthContext);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const isSafePassword = (pw: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Please enter your name.",
      });
    }
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    if (!isSafePassword(password)) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });

      return;
    }
    try {
      await api.post("/auth/register", { email, password, name });
      await login(email, password);
      toast({
        title: "Success",
        description: "Registered and logged in successfully",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-20">
      <Card className="bg-gray-800 border-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-400">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Name</Label>
              <Input
                id="name"
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-cyan-500 text-gray-900 hover:bg-cyan-400"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
