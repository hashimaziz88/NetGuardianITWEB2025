"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import router from "next/router";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="text-center mt-10 text-cyan-400">
        You are not logged in.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md mt-20">
      <Card className="bg-gray-800 border-cyan-500">
        <CardHeader>
          <CardTitle className="text-cyan-400">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-300">Email:</span>{" "}
              <span className="text-gray-100">{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">Name:</span>{" "}
              <span className="text-gray-100">{user.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-300">Role:</span>{" "}
              <span className="text-gray-100">{user.role}</span>
            </div>
            <Button
              onClick={logout}
              className="w-full bg-cyan-500 text-gray-900 hover:bg-cyan-400 mt-4"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
