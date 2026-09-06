"use client";

import { useState } from "react";

import Profile from "@/components/profile/Profile";
import SunflowerProgressMap from "./SunflowerProgressMap";

export default function HomeScreen() {
  const [user, setUser] = useState({
    username: "User123",
    avatarId: "avatar-01",
  });

  // Dummy progress sementara
  const completedChapters = [1, 2];

  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[linear-gradient(180deg,#78B9F8_0%,#B9DCFF_58%,#EAF5FF_100%)]
        px-5
        pt-80
        pb-0
        md:pt-120
      "
    >
      <Profile
        username={user.username}
        avatarId={user.avatarId}
        onAvatarChange={(avatarId) => {
          setUser((currentUser) => ({
            ...currentUser,
            avatarId,
          }));
        }}
      />

      <SunflowerProgressMap
        isAuthenticated={true}
        completedChapters={completedChapters}
        postTestCompleted={false}
      />
    </main>
  );
}