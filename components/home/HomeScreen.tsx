"use client";

import { useState } from "react";
import Profile from "@/components/profile/Profile";
import SunflowerProgressMap from "./SunflowerProgressMap";
import { useChildSession } from "@/hooks/useChildSession";
import { isGuestChapter1Completed } from "@/lib/game/guest-progress";

export default function HomeScreen() {
  const {
    child,
    loading: childLoading,
    isChildAuthenticated,
    completedChapters,
    postTestCompleted,
  } = useChildSession();

  const [guestChapter1Completed] = useState(isGuestChapter1Completed);

  const handleAvatarChange = (avatarId: string) => {
    console.log("Avatar baru:", avatarId);
  };

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
      {!childLoading && child && (
        <Profile
          username={child.username}
          avatarId={child.avatarId}
          onAvatarChange={handleAvatarChange}
        />
      )}

      <SunflowerProgressMap
        isChildAuthenticated={isChildAuthenticated}
        completedChapters={completedChapters}
        guestChapter1Completed={guestChapter1Completed}
        postTestCompleted={postTestCompleted}
      />
    </main>
  );
}
