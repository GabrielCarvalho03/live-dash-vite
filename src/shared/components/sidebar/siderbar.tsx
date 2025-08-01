"use client";

import { useState } from "react";
import { BarChart2, Tv, Users, Power, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/modules/auth/hooks/useLoginHook/useLogin";

export function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, logout, getRandomColor } = useLogin();

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <aside className="md:flex md:flex-col md:w-64">
      <header className="md:hidden flex items-center justify-between p-4 border-b">
        <h1 className="text-blue-700 text-xl font-bold flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 rounded-full p-1">
            <Tv className="h-4 w-4" />
          </span>
          LiveStream
        </h1>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          <Menu className="w-5 h-5" />
        </Button>
      </header>

      <nav className="h-full md:h-screen">
        <Card
          className={`w-64 h-full shadow-none fixed top-0 left-0 z-50 transition-transform transform
  ${open ? "translate-x-0 bg-white" : "-translate-x-full"}
  md:static md:translate-x-0 md:bg-muted/50`}
        >
          <CardContent className="p-4 flex flex-col h-full justify-between">
            <div>
              <div className="text-blue-600 text-xl font-bold mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-100 text-blue-600 rounded-full p-1">
                    <Tv className="h-4 w-4" />
                  </span>
                  LiveStream
                </div>
                <p className="text-xs font-normal text-muted-foreground ml-6">
                  Dashboard de Lives
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase">
                    Navegação
                  </Label>
                  <nav className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => navigate("/dashboard")}
                    >
                      <BarChart2 className="h-4 w-4" /> Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => navigate("/dashboard/live")}
                    >
                      <Tv className="h-4 w-4" /> Lives
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm"
                      onClick={() => navigate("/dashboard/users")}
                    >
                      <Users className="h-4 w-4" /> Usuários
                    </Button>
                  </nav>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs text-muted-foreground uppercase">
                    Status
                  </Label>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2 text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-600" />{" "}
                      Sistema Online
                    </div>
                    <div className="flex items-center gap-2">
                      <Tv className="h-4 w-4 text-muted-foreground" /> 0 Lives
                      Ativas
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="pt-6 flex items-center gap-3 border-t mt-6 ">
              <div className="rounded-full bg-blue-500  w-10 h-10 text-white  bg= flex items-center justify-center text-sm">
                {firstLetter}
              </div>
              <div className="text-sm flex-1">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email && user?.email.length > 19
                    ? `${user.email.substring(0, 19)}...`
                    : user?.email}
                </p>
              </div>
              <Button
                onClick={() => logout(navigate)}
                variant="ghost"
                size="icon"
              >
                <Power className="h-4 w-4 text-muted-foreground" />
              </Button>
            </footer>
          </CardContent>
        </Card>
      </nav>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </aside>
  );
}
