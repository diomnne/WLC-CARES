"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Navigate to profile page
  const handleProfileNavigation = () => {
    router.push("/profile");
  };

  if (user) {
    return (
      <Avatar className="cursor-pointer" onClick={handleProfileNavigation}>
        <AvatarImage
          src={user.user_metadata?.avatar_url || "/default-avatar.png"}
          alt="Profile"
        />
        <AvatarFallback>
          {user.user_metadata?.full_name?.[0] ?? "U"}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Button variant="outline" onClick={() => router.push("/login")}>
      Login
    </Button>
  );
};

export default LoginButton;
