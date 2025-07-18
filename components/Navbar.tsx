"use client";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="w-full max-w-screen-xl mx-auto px-4 flex justify-between items-center h-16">
        <Link href="/" className="text-2xl font-bold text-cyan-400">
          NETGUARDIAN
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/" className="text-gray-300 hover:text-cyan-400">
                Dashboard
              </Link>
              <Link
                href="/incidents"
                className="text-gray-300 hover:text-cyan-400"
              >
                Incidents
              </Link>
              {/* <Link href="/alert" className="text-gray-300 hover:text-cyan-400">
                Alerts
              </Link> */}
              {user.role === "admin" && (
                <Link
                  href="/users"
                  className="text-gray-300 hover:text-cyan-400"
                >
                  User Management
                </Link>
              )}
              <Link
                href="/profile"
                className="text-gray-300 hover:text-cyan-400"
              >
                Profile
              </Link>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-gray-300 flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-cyan-400">
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 hover:text-cyan-400"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6 text-gray-300" />
          </SheetTrigger>
          <SheetContent className="bg-gray-800 text-gray-300">
            <div className="flex flex-col space-y-4 mt-4">
              {user ? (
                <>
                  <Link href="/" className="hover:text-cyan-400">
                    Dashboard
                  </Link>
                  <Link href="/incidents" className="hover:text-cyan-400">
                    Incidents
                  </Link>
                  {/* <Link href="/alert" className="hover:text-cyan-400">
                    Alerts
                  </Link> */}
                  {user.role === "admin" && (
                    <Link href="/users" className="hover:text-cyan-400">
                      User Management
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="text-gray-300 hover:text-cyan-400"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-cyan-400">
                    Login
                  </Link>
                  <Link href="/register" className="hover:text-cyan-400">
                    Register
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
