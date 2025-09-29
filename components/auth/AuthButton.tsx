"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * The AuthButton component handles the display of authentication-related actions.
 * It shows "Sign in" and "Sign up" buttons for unauthenticated users.
 * For authenticated users, it displays an avatar with a dropdown menu that includes the user's email and a "Log out" option.
 */
export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Subscribes to authentication state changes to keep the UI in sync.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetches the initial user data on component mount.
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Unsubscribes from the auth state change listener when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Handles the user logout process.
   * It signs the user out using Supabase, then redirects to the login page.
   */
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  /**
   * Generates initials from the user's email to be used as a fallback for the avatar.
   */
  const getInitials = (email: string) => {
    return email ? email.slice(0, 2).toUpperCase() : "?";
  };

  return user ? (
    // If the user is authenticated, display the user avatar and dropdown menu.
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.email ?? ""}
            />
            <AvatarFallback>{getInitials(user.email ?? "")}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="text-xs leading-none text-muted-foreground">
            {user.email}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    // If the user is not authenticated, display sign-in and sign-up buttons.
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
