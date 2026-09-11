"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import Profile from "@/components/profile/Profile";
import SunflowerProgressMap from "./SunflowerProgressMap";

import { useChildSession } from "@/hooks/useChildSession";
import { isGuestChapter1Completed } from "@/lib/game/guest-progress";
import { getPostTestStatus } from "@/lib/game/progress";

type FtueStep = "welcome" | "chapter1" | "posttest" | null;

const HOME_FTUE_KEY = "risa-home-ftue-seen";

const POST_TEST_FTUE_KEY = "risa-post-test-ftue-seen";

export default function HomeScreen() {
  const router = useRouter();

  const {
    child,
    loading: childLoading,
    isChildAuthenticated,
    completedChapters,
    postTestCompleted,
  } = useChildSession();

  const [guestChapter1Completed] = useState(isGuestChapter1Completed);

  const [ftueStep, setFtueStep] = useState<FtueStep>(null);

  const postTestStatus = getPostTestStatus({
    isChildAuthenticated,
    completedChapters,
    postTestCompleted,
  });

  const postTestAvailable = postTestStatus === "current";

  /*
   * Periksa FTUE setelah progress user
   * selesai dimuat.
   */
  useEffect(() => {
    if (childLoading) return;

    const frameId = window.requestAnimationFrame(() => {
      const homeFtueSeen = localStorage.getItem(HOME_FTUE_KEY) === "true";

      const postTestFtueSeen =
        localStorage.getItem(POST_TEST_FTUE_KEY) === "true";

      let nextStep: FtueStep = null;

      if (!homeFtueSeen) {
        nextStep = "welcome";
      } else if (postTestAvailable && !postTestFtueSeen) {
        nextStep = "posttest";
      }

      setFtueStep(nextStep);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [childLoading, postTestAvailable]);

  useEffect(() => {
    if (ftueStep !== "posttest") {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById("post-test-ftue-target")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [ftueStep]);

  const handleAvatarChange = (avatarId: string) => {
    console.log("Avatar baru:", avatarId);
  };

  const scrollToChapter1 = () => {
    window.setTimeout(() => {
      document.getElementById("chapter-1-ftue-target")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleStartExplore = () => {
    setFtueStep("chapter1");

    scrollToChapter1();
  };

  const handleSkipWelcome = () => {
    localStorage.setItem(HOME_FTUE_KEY, "true");

    setFtueStep(null);
  };

  const handleStartChapter1 = () => {
    localStorage.setItem(HOME_FTUE_KEY, "true");

    setFtueStep(null);

    router.push("/chapters/chapter-1");
  };

  const handleStartPostTest = () => {
    localStorage.setItem(POST_TEST_FTUE_KEY, "true");

    setFtueStep(null);

    router.push("/post-test");
  };

  const handlePostTestLater = () => {
    localStorage.setItem(POST_TEST_FTUE_KEY, "true");

    setFtueStep(null);
  };

  return (
    <>
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
        {/* SEO + accessibility */}
        <section className="sr-only">
          <h1>RISA - Remaja Indonesia Sehat</h1>

          <p>
            Jelajahi materi interaktif tentang tubuh, menstruasi, kebersihan,
            gizi, batas yang aman, dan kesehatan reproduksi.
          </p>
        </section>

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
          showChapter1Ftue={ftueStep === "chapter1"}
          showPostTestFtue={ftueStep === "posttest"}
          onStartChapter1={handleStartChapter1}
        />
      </main>

      {/* ===================== */}
      {/* WELCOME FTUE */}
      {/* ===================== */}

      {ftueStep === "welcome" && (
        <div
          className="
            fixed inset-0 z-100

            flex
            items-center
            justify-center

            bg-black/35
            px-4

            backdrop-blur-[2px]
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            className="
              w-full
              max-w-md

              rounded-3xl
              border-2
              border-pink-200

              bg-white/95

              px-6
              py-8

              text-center

              shadow-2xl

              sm:px-8
              sm:py-9
            "
          >
            <div
              className="
                text-5xl
                leading-none
              "
            >
              🌻
            </div>

            <h2
              id="welcome-title"
              className="
                mt-5

                font-jaro

                text-3xl
                text-pink-600

                sm:text-4xl
              "
            >
              Selamat datang di RISA!
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-sm

                text-sm
                leading-6
                text-gray-600

                sm:text-base
                sm:leading-7
              "
            >
              Jelajahi materi interaktif tentang tubuh, menstruasi, kebersihan,
              gizi, batas yang aman, dan kesehatan reproduksi.
            </p>

            <button
              type="button"
              onClick={handleStartExplore}
              className="
                mt-7
                w-full

                rounded-full

                bg-pink-500

                px-6
                py-3.5

                text-sm
                font-bold
                text-white

                shadow-md

                transition

                hover:bg-pink-600
                hover:shadow-lg

                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-pink-200
              "
            >
              Mulai jelajah
            </button>

            <button
              type="button"
              onClick={handleSkipWelcome}
              className="
                mt-3

                px-5
                py-2

                text-sm
                font-medium
                text-gray-400

                transition

                hover:text-gray-600
              "
            >
              Lewati
            </button>

            <p
              className="
                mt-3
                text-xs
                text-gray-400
              "
            >
              1 / 2
            </p>
          </div>
        </div>
      )}

      {/* ===================== */}
      {/* POST TEST FTUE */}
      {/* ===================== */}

      {ftueStep === "posttest" && (
        <div
          className="
            fixed inset-0 z-100

            flex
            items-end
            justify-center

            bg-black/25

            px-4
            pb-5

            backdrop-blur-[1px]

            sm:items-center
            sm:pb-0
          "
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-test-title"
            className="
              w-full
              max-w-sm

              rounded-3xl
              border-2
              border-yellow-200

              bg-white/95

              px-6
              py-7

              text-center

              shadow-2xl
            "
          >
            <div
              className="
                mx-auto

                flex
                h-14
                w-14

                items-center
                justify-center

                rounded-full

                bg-yellow-100
              "
            >
              <CheckCircle2
                className="
                  h-8
                  w-8

                  text-yellow-600
                "
              />
            </div>

            <h2
              id="post-test-title"
              className="
                mt-4

                font-jaro

                text-3xl
                text-[#52731C]
              "
            >
              Semua chapter selesai! 🌻
            </h2>

            <p
              className="
                mt-3

                text-sm
                leading-6
                text-gray-600
              "
            >
              Kamu sudah menyelesaikan Chapter 1 sampai 7. Sekarang waktunya
              menguji apa yang sudah kamu pelajari.
            </p>

            <button
              type="button"
              onClick={handleStartPostTest}
              className="
                mt-6
                w-full

                rounded-full

                bg-[#6F8F2F]

                px-6
                py-3.5

                text-sm
                font-bold
                text-white

                shadow-md

                transition

                hover:bg-[#5E7928]
              "
            >
              Mulai Post Test
            </button>

            <button
              type="button"
              onClick={handlePostTestLater}
              className="
                mt-3
                px-4
                py-2

                text-sm
                font-medium
                text-gray-400

                hover:text-gray-600
              "
            >
              Nanti saja
            </button>
          </div>
        </div>
      )}
    </>
  );
}
