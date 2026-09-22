"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { CHARACTERS } from "@/components/profile/data-local";
import { useChildSession } from "@/hooks/useChildSession";
import { childApiFetch, ChildApiError } from "@/lib/api/child-client";

type Category = "STORY" | "QUESTION" | "TIPS" | "SUPPORT";
type CategoryFilter = "ALL" | Category;

type Author = {
  username: string;
  avatarId: string;
};

type CommunityPost = {
  id: string;
  title: string | null;
  content: string;
  category: Category;
  isAnonymous: boolean;
  author: Author | null;
  isOwner: boolean;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

type CommunityComment = {
  id: string;
  content: string;
  isAnonymous: boolean;
  author: Author | null;
  isOwner: boolean;
  createdAt: string;
};

type FeedResponse = {
  success: boolean;
  data: {
    posts: CommunityPost[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };
  };
};

type PostResponse = {
  success: boolean;
  data: { post: CommunityPost };
};

type CommentsResponse = {
  success: boolean;
  data: { comments: CommunityComment[] };
};

type CommentResponse = {
  success: boolean;
  data: { comment: CommunityComment };
};

const CATEGORIES: Array<{
  value: CategoryFilter;
  label: string;
  shortLabel: string;
  color: string;
}> = [
  {
    value: "ALL",
    label: "Semua",
    shortLabel: "Semua",
    color: "bg-white text-[#59675D] border-[#DDE4DA]",
  },
  {
    value: "STORY",
    label: "Cerita",
    shortLabel: "Cerita",
    color: "bg-[#FFE8F0] text-[#A94E71] border-[#F8C9D9]",
  },
  {
    value: "QUESTION",
    label: "Mau tanya",
    shortLabel: "Tanya",
    color: "bg-[#E7F2FF] text-[#4276A6] border-[#C6E0F7]",
  },
  {
    value: "TIPS",
    label: "Berbagi tips",
    shortLabel: "Tips",
    color: "bg-[#FFF3C9] text-[#8B6A1F] border-[#F0D986]",
  },
  {
    value: "SUPPORT",
    label: "Butuh dukungan",
    shortLabel: "Dukungan",
    color: "bg-[#E9F4E4] text-[#50764F] border-[#CBE0C3]",
  },
];

type ModerationSuggestion = {
  reason: string;
  suggestedTitle: string;
  suggestedContent: string;
};

type ModerationErrorResponse = {
  success: false;
  code: "CONTENT_NEEDS_REVISION";
  message: string;
  moderation: ModerationSuggestion;
};

function categoryData(category: CategoryFilter) {
  return CATEGORIES.find((item) => item.value === category) ?? CATEGORIES[0];
}

function avatarSource(avatarId: string) {
  return (
    CHARACTERS.find((character) => character.id === avatarId) ?? CHARACTERS[0]
  ).src;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function AuthorAvatar({ author }: { author: Author | null }) {
  if (!author) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2EAF5] text-[#8A668F]">
        <UserRound className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#EAF2E6]">
      <Image
        src={avatarSource(author.avatarId)}
        alt=""
        fill
        sizes="44px"
        className="object-contain object-bottom"
      />
    </div>
  );
}

export default function TemankuContent() {
  const router = useRouter();
  const {
    child,
    loading: sessionLoading,
    isChildAuthenticated,
  } = useChildSession();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filter, setFilter] = useState<CategoryFilter>("ALL");
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("STORY");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);

  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsByPost, setCommentsByPost] = useState<
    Record<string, CommunityComment[]>
  >({});
  const [commentsLoading, setCommentsLoading] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>(
    {},
  );
  const [commentAnonymous, setCommentAnonymous] = useState<
    Record<string, boolean>
  >({});
  const [commentSubmitting, setCommentSubmitting] = useState<string | null>(
    null,
  );

  const [moderationSuggestion, setModerationSuggestion] =
    useState<ModerationSuggestion | null>(null);

  const loadPosts = useCallback(async () => {
    if (!isChildAuthenticated) {
      setFeedLoading(false);
      return;
    }

    try {
      setFeedLoading(true);
      setFeedError("");

      const response = await childApiFetch<FeedResponse>(
        `/api/community/posts?category=${filter}&page=1`,
        { cache: "no-store" },
      );

      setPosts(response.data.posts);
    } catch (error) {
      setFeedError(
        error instanceof Error
          ? error.message
          : "Cerita Temanku belum berhasil dimuat.",
      );
    } finally {
      setFeedLoading(false);
    }
  }, [filter, isChildAuthenticated]);

  useEffect(() => {
    if (!sessionLoading) {
      void loadPosts();
    }
  }, [loadPosts, sessionLoading]);

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim() || posting) {
      return;
    }

    try {
      setPosting(true);
      setFeedError("");
      setModerationSuggestion(null);

      const response = await childApiFetch<PostResponse>(
        "/api/community/posts",
        {
          method: "POST",

          body: JSON.stringify({
            title,
            content,
            category,
            isAnonymous,
          }),
        },
      );

      setPosts((current) => [response.data.post, ...current]);

      setTitle("");
      setContent("");
      setIsAnonymous(false);
      setModerationSuggestion(null);
    } catch (error) {
      if (error instanceof ChildApiError && error.status === 422) {
        const errorData = error.data as ModerationErrorResponse | undefined;

        if (
          errorData?.code === "CONTENT_NEEDS_REVISION" &&
          errorData.moderation
        ) {
          setModerationSuggestion(errorData.moderation);

          setFeedError("");
          return;
        }
      }

      setFeedError(
        error instanceof Error
          ? error.message
          : "Cerita belum berhasil dikirim.",
      );
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(post: CommunityPost) {
    const nextLiked = !post.likedByMe;

    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likedByMe: nextLiked,
              likeCount: Math.max(0, item.likeCount + (nextLiked ? 1 : -1)),
            }
          : item,
      ),
    );

    try {
      await childApiFetch(`/api/community/posts/${post.id}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      });
    } catch (error) {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                likedByMe: post.likedByMe,
                likeCount: post.likeCount,
              }
            : item,
        ),
      );
      setFeedError(
        error instanceof Error
          ? error.message
          : "Like belum berhasil disimpan.",
      );
    }
  }

  async function toggleComments(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);

    if (commentsByPost[postId]) return;

    try {
      setCommentsLoading(postId);
      const response = await childApiFetch<CommentsResponse>(
        `/api/community/posts/${postId}/comments`,
        { cache: "no-store" },
      );

      setCommentsByPost((current) => ({
        ...current,
        [postId]: response.data.comments,
      }));
    } catch (error) {
      setFeedError(
        error instanceof Error ? error.message : "Komentar belum bisa dibuka.",
      );
    } finally {
      setCommentsLoading(null);
    }
  }

  async function submitComment(postId: string) {
    const draft = commentDrafts[postId]?.trim();
    if (!draft || commentSubmitting) return;

    try {
      setCommentSubmitting(postId);

      const response = await childApiFetch<CommentResponse>(
        `/api/community/posts/${postId}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: draft,
            isAnonymous: commentAnonymous[postId] === true,
          }),
        },
      );

      setCommentsByPost((current) => ({
        ...current,
        [postId]: [...(current[postId] ?? []), response.data.comment],
      }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post,
        ),
      );
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      setCommentAnonymous((current) => ({ ...current, [postId]: false }));
    } catch (error) {
      setFeedError(
        error instanceof Error
          ? error.message
          : "Komentar belum berhasil dikirim.",
      );
    } finally {
      setCommentSubmitting(null);
    }
  }

  async function removePost(postId: string) {
    if (!window.confirm("Hapus postingan ini?")) return;

    try {
      await childApiFetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
      });
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (error) {
      setFeedError(
        error instanceof Error
          ? error.message
          : "Postingan belum berhasil dihapus.",
      );
    }
  }

  async function removeComment(postId: string, commentId: string) {
    if (!window.confirm("Hapus komentar ini?")) return;

    try {
      await childApiFetch(`/api/community/comments/${commentId}`, {
        method: "DELETE",
      });
      setCommentsByPost((current) => ({
        ...current,
        [postId]: (current[postId] ?? []).filter(
          (comment) => comment.id !== commentId,
        ),
      }));
      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, commentCount: Math.max(0, post.commentCount - 1) }
            : post,
        ),
      );
    } catch (error) {
      setFeedError(
        error instanceof Error
          ? error.message
          : "Komentar belum berhasil dihapus.",
      );
    }
  }

  if (sessionLoading) {
    return (
      <div
        className="
          fixed inset-0
          flex flex-col items-center justify-center gap-5
          bg-[linear-gradient(180deg,#78B9F8_0%,#B9DCFF_58%,#EAF5FF_100%)]
        "
      >
        <div
          className="
            h-12 w-12
            rounded-full
            border-4 border-white/40
            border-t-white
            animate-spin
          "
        />
        <p className="font-jaro text-xl text-white drop-shadow">
          Memuat...
        </p>
      </div>
    );
  }

  if (!isChildAuthenticated || !child) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#78B9F8_0%,#B9DCFF_58%,#EAF5FF_100%)] px-5 py-10">
        <section className="w-full max-w-md rounded-4xl border border-[#F1D4DE] bg-white p-7 text-center shadow-[0_18px_50px_rgba(112,78,92,0.12)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE5EF] text-[#D95F89]">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-jaro text-4xl text-pink-500">Temanku</h1>
          <p className="mt-3 text-sm leading-7 text-gray-500">
            Masuk dengan akun anak untuk membaca cerita dan berbagi bersama
            teman sebaya dengan aman.
          </p>
          <button
            type="button"
            onClick={() => router.push("/child/login?next=%2Ftemanku")}
            className="mt-7 min-h-12 w-full rounded-full bg-pink-500 px-6 text-sm font-bold text-white"
          >
            Masuk ke RISA
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-3 min-h-11 w-full rounded-full text-sm font-semibold text-gray-500"
          >
            Kembali ke beranda
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#78B9F8_0%,#B9DCFF_58%,#EAF5FF_100%)] pb-16">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Kembali ke beranda"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E3E7DE] bg-white text-[#557A59]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#7A8D78]">
              Ruang cerita
            </p>
            <h1 className="font-jaro text-3xl leading-none text-[#C6537D]">
              Temanku
            </h1>
          </div>
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#E7F1E3]">
            <Image
              src={avatarSource(child.avatarId)}
              alt="Avatar kamu"
              fill
              sizes="44px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8">
        <section className="overflow-hidden rounded-4xl border border-[#F1D8DF] bg-white shadow-[0_16px_44px_rgba(112,78,92,0.10)]">
          <div className="bg-pink-100 px-6 py-7 sm:px-8">
            <div className="flex items-start gap-4">
              <div>
                <h2 className="font-jaro text-3xl text-[#A94E71]">
                  Hai, {child.username}!
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#6B6661]">
                  Kamu boleh berbagi cerita, bertanya, atau memberi semangat.
                  Kita belajar saling mendengar tanpa menghakimi.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F4E4E8] bg-[#FFFCFA] px-5 py-4 sm:px-8">
            <div className="flex gap-3 text-xs leading-5 text-[#726C67]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#5E835F]" />
              <p>
                Jaga privasi: jangan tulis nama lengkap, alamat, nomor telepon,
                nama sekolah, atau kata sandi. Temanku bukan pengganti bantuan
                orang dewasa atau tenaga kesehatan.
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleCreatePost}
          className="mt-5 rounded-4xl border border-[#E8DDD8] bg-white p-5 shadow-[0_12px_35px_rgba(100,77,66,0.08)] sm:p-7"
        >
          <div className="flex items-center gap-3">
            <AuthorAvatar
              author={
                isAnonymous
                  ? null
                  : { username: child.username, avatarId: child.avatarId }
              }
            />
            <div>
              <h2 className="font-bold text-[#3F4C42]">Bagikan sesuatu</h2>
              <p className="text-xs text-[#899087]">
                {isAnonymous
                  ? "Akan tampil sebagai Teman anonim"
                  : `Sebagai @${child.username}`}
              </p>
            </div>
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value.slice(0, 80))}
            placeholder="Judul singkat (opsional)"
            className="mt-5 w-full rounded-2xl border border-[#E5E2DC] bg-[#FFFEFC] px-4 py-3 text-sm font-semibold text-[#404A42] outline-none transition placeholder:font-normal placeholder:text-[#A1A49F] focus:border-[#E7A2B9] focus:ring-4 focus:ring-[#F8DCE5]"
          />
          <textarea
            required
            value={content}
            onChange={(event) => setContent(event.target.value.slice(0, 500))}
            placeholder="Apa yang ingin kamu ceritakan?"
            rows={4}
            className="mt-3 w-full resize-none rounded-2xl border border-[#E5E2DC] bg-[#FFFEFC] px-4 py-3 text-sm leading-6 text-[#4F5951] outline-none transition placeholder:text-[#A1A49F] focus:border-[#E7A2B9] focus:ring-4 focus:ring-[#F8DCE5]"
          />
          <div className="mt-1 flex justify-end text-xs text-[#959B94]">
            {content.length}/500
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.filter((item) => item.value !== "ALL").map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value as Category)}
                aria-pressed={category === item.value}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
                  category === item.value
                    ? `${item.color} ring-2 ring-offset-1 ring-[#E9A9BD]`
                    : "border-[#E5E6E1] bg-white text-[#737B73]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {moderationSuggestion && (
            <div className="mt-4 rounded-2xl border border-[#F2CF71] bg-[#FFF8D9] p-4">
              <p className="font-semibold text-[#6B5725]">
                Yuk, rapikan sedikit
              </p>

              <p className="mt-1 text-sm text-[#756840]">
                {moderationSuggestion.reason}
              </p>

              <div className="mt-3 rounded-xl bg-white p-3">
                <p className="font-medium">
                  {moderationSuggestion.suggestedTitle}
                </p>

                <p className="mt-1 text-sm">
                  {moderationSuggestion.suggestedContent}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitle(moderationSuggestion.suggestedTitle);

                    setContent(moderationSuggestion.suggestedContent);

                    setModerationSuggestion(null);
                  }}
                  className="rounded-xl bg-[#F39AB5] px-4 py-2 font-semibold text-white"
                >
                  Gunakan saran
                </button>

                <button
                  type="button"
                  onClick={() => setModerationSuggestion(null)}
                  className="rounded-xl bg-white px-4 py-2 text-[#6B5725]"
                >
                  Edit sendiri
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-col gap-4 border-t border-[#F0ECE7] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#5E6860]">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="h-5 w-5 accent-[#D7648C]"
              />
              Kirim sebagai anonim
            </label>
            <button
              type="submit"
              disabled={!content.trim() || posting}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#557A59] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(85,122,89,0.20)] transition hover:bg-[#486B4C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {posting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {posting ? "Mengirim..." : "Kirim cerita"}
            </button>
          </div>
        </form>

        <nav
          aria-label="Filter kategori Temanku"
          className="mt-6 flex gap-2 overflow-x-auto pb-2"
        >
          {CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition ${
                filter === item.value
                  ? item.color
                  : "border-white/80 bg-white/70 text-[#727A72]"
              }`}
            >
              {item.shortLabel}
            </button>
          ))}
        </nav>

        {feedError && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-[#F1CBCB] bg-[#FFF6F6] px-4 py-3 text-sm text-[#9C4D4D]"
          >
            {feedError}
          </div>
        )}

        <section aria-label="Cerita Temanku" className="mt-4 space-y-4">
          {feedLoading ? (
            <div className="rounded-4xl bg-white p-8 text-center text-sm text-[#788178]">
              <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-[#D7648C]" />
              <p className="mt-3">Mengumpulkan cerita teman...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-4xl border border-[#E5E5DC] bg-white p-8 text-center">
              <h2 className="mt-3 font-jaro text-3xl text-[#557A59]">
                Belum ada cerita
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#778078]">
                Jadilah teman pertama yang berbagi di kategori ini.
              </p>
            </div>
          ) : (
            posts.map((post) => {
              const tag = categoryData(post.category);
              const comments = commentsByPost[post.id] ?? [];
              const commentsOpen = expandedPostId === post.id;

              return (
                <article
                  key={post.id}
                  className="rounded-4xl border border-[#E9E2DD] bg-white p-5 shadow-[0_10px_32px_rgba(95,76,67,0.07)] sm:p-6"
                >
                  <header className="flex items-start gap-3">
                    <AuthorAvatar author={post.author} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-bold text-[#3F4C42]">
                          {post.author
                            ? `@${post.author.username}`
                            : post.isOwner
                              ? "Postinganmu · anonim"
                              : "Teman anonim"}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${tag.color}`}
                        >
                          {tag.shortLabel}
                        </span>
                      </div>
                      <time className="mt-1 block text-xs text-[#969C96]">
                        {formatTime(post.createdAt)}
                      </time>
                    </div>
                    {post.isOwner && (
                      <button
                        type="button"
                        onClick={() => void removePost(post.id)}
                        aria-label="Hapus postingan"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#A68E8E] transition hover:bg-[#FFF0F0] hover:text-[#B95656]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </header>

                  {post.title && (
                    <h2 className="mt-4 text-base font-extrabold text-[#37433A]">
                      {post.title}
                    </h2>
                  )}
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#5C665E]">
                    {post.content}
                  </p>

                  <div className="mt-5 flex items-center gap-2 border-t border-[#F0ECE8] pt-3">
                    <button
                      type="button"
                      onClick={() => void toggleLike(post)}
                      aria-pressed={post.likedByMe}
                      className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-bold transition ${
                        post.likedByMe
                          ? "bg-[#FFE7EF] text-[#C84F78]"
                          : "text-[#707A72] hover:bg-[#FFF1F5]"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${post.likedByMe ? "fill-current" : ""}`}
                      />
                      {post.likeCount}
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleComments(post.id)}
                      aria-expanded={commentsOpen}
                      className="flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-bold text-[#66766A] transition hover:bg-[#EEF5EB]"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {post.commentCount} komentar
                    </button>
                  </div>

                  {commentsOpen && (
                    <div className="mt-3 rounded-2xl bg-[#FAF9F6] p-4">
                      {commentsLoading === post.id ? (
                        <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-[#D7648C]" />
                      ) : comments.length === 0 ? (
                        <p className="text-center text-xs text-[#8B928C]">
                          Belum ada komentar. Beri dukungan pertama.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <AuthorAvatar author={comment.author} />
                              <div className="min-w-0 flex-1 rounded-2xl bg-white px-4 py-3">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-xs font-bold text-[#4B574E]">
                                    {comment.author
                                      ? `@${comment.author.username}`
                                      : comment.isOwner
                                        ? "Komentarmu · anonim"
                                        : "Teman anonim"}
                                  </span>
                                  {comment.isOwner && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void removeComment(post.id, comment.id)
                                      }
                                      aria-label="Hapus komentar"
                                      className="text-[#AC9999] hover:text-[#B95656]"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="mt-1 break-words text-xs leading-5 text-[#626C64]">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 border-t border-[#E8E7E1] pt-4">
                        <div className="flex gap-2">
                          <input
                            value={commentDrafts[post.id] ?? ""}
                            onChange={(event) =>
                              setCommentDrafts((current) => ({
                                ...current,
                                [post.id]: event.target.value.slice(0, 300),
                              }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void submitComment(post.id);
                              }
                            }}
                            placeholder="Tulis komentar yang baik..."
                            className="min-w-0 flex-1 rounded-full border border-[#DFE3DC] bg-white px-4 py-2.5 text-xs outline-none focus:border-[#9AB49A]"
                          />
                          <button
                            type="button"
                            onClick={() => void submitComment(post.id)}
                            disabled={
                              !commentDrafts[post.id]?.trim() ||
                              commentSubmitting === post.id
                            }
                            aria-label="Kirim komentar"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#557A59] text-white disabled:opacity-40"
                          >
                            {commentSubmitting === post.id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-[11px] font-semibold text-[#788078]">
                          <input
                            type="checkbox"
                            checked={commentAnonymous[post.id] === true}
                            onChange={(event) =>
                              setCommentAnonymous((current) => ({
                                ...current,
                                [post.id]: event.target.checked,
                              }))
                            }
                            className="h-4 w-4 accent-[#D7648C]"
                          />
                          Komentar sebagai anonim
                        </label>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
