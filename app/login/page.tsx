"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useContext(AuthContext);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    try {
      await login(email, password);
      toast({ title: "Success", description: "Logged in successfully" });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid credentials",
      });
    }
  };

  if (user) {
    // Show logout/user view if logged in
    return (
      <div className="container mx-auto max-w-md mt-20">
        <Card className="bg-gray-800 border-cyan-500">
          <CardHeader>
            <CardTitle className="text-cyan-400">
              Welcome, {user.email}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  logout();
                  toast({
                    title: "Logged out",
                    description: "You have been logged out.",
                  });
                }}
                className="w-full bg-cyan-500 text-gray-900 hover:bg-cyan-400"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md mt-20">
      <Card className="bg-gray-800 border-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-400">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
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
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
