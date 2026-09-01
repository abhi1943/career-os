
import {
    MessageCircle,
    Heart,
    User,
    Send,
    Loader2,
    Trash2,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    auth,
} from "../../firebase/firebase";

import {
    createChatboardReply,
    getChatboardReplies,
    hasLikedChatboardPost,
    deleteChatboardReply,
} from "../../services/chatboardService";

// ======================================================
// CHATBOARD POST
// ======================================================

function ChatboardPost({
    post,
    currentUser,
    onLike,
    onDeletePost,
}) {

    // ======================================================
    // STATE
    // ======================================================

    const [replies, setReplies] =
        useState([]);

    const [replyText, setReplyText] =
        useState("");

    const [showReplies, setShowReplies] =
        useState(false);

    const [loadingReplies, setLoadingReplies] =
        useState(false);

    const [submittingReply, setSubmittingReply] =
        useState(false);

    const [replyError, setReplyError] =
        useState("");

    const [hasLiked, setHasLiked] =
        useState(false);

    const [checkingLike, setCheckingLike] =
        useState(true);

    const [deletingReplyId, setDeletingReplyId] =
        useState(null);

    const [deletingPost, setDeletingPost] =
        useState(false);

    // ======================================================
    // CURRENT USER
    // ======================================================

    const activeUser =
        currentUser ||
        auth.currentUser ||
        null;

    const currentUserId =
        activeUser?.uid ||
        null;

    // ======================================================
    // IS POST OWNER
    // ======================================================

    const isPostOwner =
        Boolean(
            currentUserId &&
            post?.authorId &&
            currentUserId ===
            post.authorId
        );

    // ======================================================
    // CHECK LIKE
    // ======================================================

    useEffect(() => {

        let mounted = true;

        const checkLike =
            async () => {

                setCheckingLike(true);

                if (
                    !post?.id ||
                    !currentUserId
                ) {

                    if (mounted) {

                        setHasLiked(false);
                        setCheckingLike(false);

                    }

                    return;
                }

                try {

                    const liked =
                        await hasLikedChatboardPost(
                            post.id,
                            currentUserId
                        );

                    if (mounted) {

                        setHasLiked(
                            Boolean(liked)
                        );
                    }

                } catch (error) {

                    console.error(
                        "CareerOS Chatboard like status error:",
                        error
                    );

                    if (mounted) {

                        setHasLiked(false);
                    }

                } finally {

                    if (mounted) {

                        setCheckingLike(false);
                    }
                }
            };

        checkLike();

        return () => {
            mounted = false;
        };

    }, [
        post?.id,
        currentUserId,
    ]);

    // ======================================================
    // LOAD REPLIES
    // ======================================================

    useEffect(() => {

        let mounted = true;

        const loadReplies =
            async () => {

                if (!post?.id) {
                    return;
                }

                setLoadingReplies(true);

                try {

                    const loadedReplies =
                        await getChatboardReplies(
                            post.id
                        );

                    if (!mounted) {
                        return;
                    }

                    setReplies(
                        Array.isArray(
                            loadedReplies
                        )
                            ? loadedReplies
                            : []
                    );

                } catch (error) {

                    console.error(
                        "CareerOS Chatboard replies load error:",
                        error
                    );

                    if (mounted) {

                        setReplyError(
                            "Unable to load replies."
                        );
                    }

                } finally {

                    if (mounted) {

                        setLoadingReplies(false);
                    }
                }
            };

        loadReplies();

        return () => {
            mounted = false;
        };

    }, [
        post?.id,
    ]);

    // ======================================================
    // TOGGLE REPLIES
    // ======================================================

    const handleToggleReplies =
        () => {

            setReplyError("");

            setShowReplies(
                (previous) =>
                    !previous
            );
        };

    // ======================================================
    // CREATE REPLY
    // ======================================================

    const handleReplySubmit =
        async (event) => {

            event.preventDefault();

            const trimmedReply =
                replyText.trim();

            if (!trimmedReply) {
                return;
            }

            setSubmittingReply(true);
            setReplyError("");

            try {

                const user =
                    auth.currentUser ||
                    currentUser ||
                    null;

                if (!user) {

                    throw new Error(
                        "Please sign in before replying."
                    );
                }

                const newReply =
                    await createChatboardReply({

                        postId:
                            post.id,

                        authorId:
                            user.uid,

                        authorName:
                            user.displayName ||
                            "CareerOS User",

                        content:
                            trimmedReply,

                    });

                setReplies(
                    (previousReplies) => [

                        ...previousReplies,

                        {
                            ...newReply,

                            createdAt:
                                newReply.createdAt ||
                                new Date(),
                        },

                    ]
                );

                setReplyText("");
                setShowReplies(true);

            } catch (error) {

                console.error(
                    "CareerOS Chatboard reply error:",
                    error
                );

                setReplyError(
                    error?.message ||
                    "Unable to post your reply."
                );

            } finally {

                setSubmittingReply(false);
            }
        };

    // ======================================================
    // LIKE / DISLIKE
    // ======================================================

    const handleLike =
        async () => {

            const user =
                auth.currentUser ||
                currentUser ||
                null;

            if (!user) {

                setReplyError(
                    "Please sign in before liking this discussion."
                );

                return;
            }

            try {

                const result =
                    await onLike?.(
                        post,
                        user.uid
                    );

                if (result?.liked) {

                    setHasLiked(true);

                    return;
                }

                if (result?.unliked) {

                    setHasLiked(false);

                    return;
                }

                if (result?.alreadyLiked) {

                    setHasLiked(true);
                }

            } catch (error) {

                console.error(
                    "CareerOS Chatboard like error:",
                    error
                );

                setReplyError(
                    error?.message ||
                    "Unable to update this like."
                );
            }
        };

    // ======================================================
    // DELETE POST
    // ======================================================

    const handleDeletePost =
        async () => {

            const user =
                auth.currentUser ||
                currentUser ||
                null;

            // ==================================================
            // AUTH CHECK
            // ==================================================

            if (!user) {

                setReplyError(
                    "Please sign in before deleting this discussion."
                );

                return;
            }

            // ==================================================
            // OWNER CHECK
            // ==================================================

            if (
                !post?.authorId ||
                post.authorId !== user.uid
            ) {

                setReplyError(
                    "You can only delete your own discussions."
                );

                return;
            }

            // ==================================================
            // POST ID CHECK
            // ==================================================

            if (!post?.id) {

                setReplyError(
                    "Unable to delete this discussion because the post ID is missing."
                );

                return;
            }

            // ==================================================
            // DELETE HANDLER CHECK
            // ==================================================

            if (
                typeof onDeletePost !==
                "function"
            ) {

                console.error(
                    "🔥 CHATBOARD DELETE ERROR: onDelete handler is missing."
                );

                setReplyError(
                    "Unable to delete this discussion."
                );

                return;
            }

            // ==================================================
            // CONFIRMATION
            // ==================================================

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this discussion?"
                );

            if (!confirmed) {
                return;
            }

            setDeletingPost(true);
            setReplyError("");

            try {

                

                // ==================================================
                // CALL PARENT DELETE HANDLER
                // ==================================================

                const result =
                    await onDeletePost(
                        post,
                        user.uid
                    );

                // ==================================================
                // REQUIRE TRUE
                // ==================================================
                //
                // Chatboard.jsx returns true only after the
                // Firestore delete succeeds.
                //
                // ==================================================

                if (
                    result !== true
                ) {

                    throw new Error(
                        "The discussion could not be deleted."
                    );
                }

                

            } catch (error) {

                console.error(
                    "🔥 CHATBOARD POST DELETE ERROR:",
                    error
                );

                setReplyError(
                    error?.message ||
                    "Unable to delete this discussion."
                );

            } finally {

                setDeletingPost(false);
            }
        };

    // ======================================================
    // DELETE REPLY
    // ======================================================

    const handleDeleteReply =
        async (reply) => {

            const user =
                auth.currentUser ||
                currentUser ||
                null;

            if (
                !user ||
                reply.authorId !== user.uid
            ) {

                return;
            }

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this reply?"
                );

            if (!confirmed) {
                return;
            }

            setDeletingReplyId(
                reply.id
            );

            setReplyError("");

            try {

                await deleteChatboardReply(
                    post.id,
                    reply.id
                );

                setReplies(
                    (previousReplies) =>
                        previousReplies.filter(
                            (item) =>
                                item.id !==
                                reply.id
                        )
                );

            } catch (error) {

                console.error(
                    "CareerOS Chatboard reply delete error:",
                    error
                );

                setReplyError(
                    error?.message ||
                    "Unable to delete this reply."
                );

            } finally {

                setDeletingReplyId(null);
            }
        };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

            {/* ==================================================
                POST HEADER
            ================================================== */}

            <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">

                        <User className="w-5 h-5 text-blue-600" />

                    </div>

                    <div>

                        <p className="font-semibold text-slate-900">

                            {post.authorName ||
                                "CareerOS Student"}

                        </p>

                        <p className="text-xs text-slate-500">

                            {post.category ||
                                "General"}

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    {post.createdAt && (

                        <span className="text-xs text-slate-400">

                            {formatDate(
                                post.createdAt
                            )}

                        </span>

                    )}

                    {/* ==================================================
                        DELETE POST
                    ================================================== */}

                    {isPostOwner && (

                        <button
                            type="button"
                            onClick={
                                handleDeletePost
                            }
                            disabled={
                                deletingPost
                            }
                            title="Delete your discussion"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >

                            {deletingPost ? (

                                <Loader2 className="w-4 h-4 animate-spin" />

                            ) : (

                                <Trash2 className="w-4 h-4" />

                            )}

                        </button>

                    )}

                </div>

            </div>

            {/* ==================================================
                TITLE
            ================================================== */}

            <h2 className="text-xl font-bold text-slate-900 mt-5">

                {post.title}

            </h2>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <p className="text-slate-600 mt-3 whitespace-pre-wrap leading-relaxed">

                {post.content}

            </p>

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">

                {/* ==================================================
                    LIKE
                ================================================== */}

                <button
                    type="button"
                    onClick={
                        handleLike
                    }
                    disabled={
                        !currentUserId ||
                        checkingLike
                    }
                    title={
                        !currentUserId
                            ? "Please sign in to like"
                            : hasLiked
                                ? "Click to dislike"
                                : "Like this discussion"
                    }
                    className={`
                        flex
                        items-center
                        gap-2
                        transition

                        ${hasLiked
                            ? "text-red-500 hover:text-slate-500"
                            : !currentUserId ||
                                checkingLike
                                ? "text-slate-300 cursor-not-allowed"
                                : "text-slate-500 hover:text-red-500"
                        }
                    `}
                >

                    <Heart
                        className="w-5 h-5"
                        fill={
                            hasLiked
                                ? "currentColor"
                                : "none"
                        }
                    />

                    <span className="text-sm">

                        {post.likes || 0}

                    </span>

                </button>

                {/* ==================================================
                    REPLIES
                ================================================== */}

                <button
                    type="button"
                    onClick={
                        handleToggleReplies
                    }
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition"
                >

                    <MessageCircle className="w-5 h-5" />

                    <span className="text-sm">

                        {replies.length > 0
                            ? `${replies.length} ${replies.length === 1
                                ? "Reply"
                                : "Replies"
                            }`
                            : "Reply"}

                    </span>

                </button>

            </div>

            {/* ==================================================
                REPLIES
            ================================================== */}

            {showReplies && (

                <div className="mt-5 pt-5 border-t border-slate-100">

                    {loadingReplies ? (

                        <div className="flex items-center gap-2 text-sm text-slate-500">

                            <Loader2 className="w-4 h-4 animate-spin" />

                            Loading replies...

                        </div>

                    ) : (

                        <>

                            {/* ==================================================
                                EXISTING REPLIES
                            ================================================== */}

                            {replies.length > 0 && (

                                <div className="space-y-4 mb-5">

                                    {replies.map(
                                        (reply) => {

                                            const isReplyOwner =
                                                Boolean(
                                                    currentUserId &&
                                                    reply.authorId ===
                                                    currentUserId
                                                );

                                            return (

                                                <div
                                                    key={
                                                        reply.id
                                                    }
                                                    className="bg-slate-50 rounded-xl p-4"
                                                >

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div className="flex items-center gap-2">

                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">

                                                                <User className="w-4 h-4 text-blue-600" />

                                                            </div>

                                                            <div>

                                                                <p className="text-sm font-semibold text-slate-900">

                                                                    {reply.authorName ||
                                                                        "CareerOS User"}

                                                                </p>

                                                                {reply.createdAt && (

                                                                    <p className="text-xs text-slate-400">

                                                                        {formatDate(
                                                                            reply.createdAt
                                                                        )}

                                                                    </p>

                                                                )}

                                                            </div>

                                                        </div>

                                                        {isReplyOwner && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeleteReply(
                                                                        reply
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingReplyId ===
                                                                    reply.id
                                                                }
                                                                title="Delete your reply"
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                                                            >

                                                                {deletingReplyId ===
                                                                    reply.id ? (

                                                                    <Loader2 className="w-4 h-4 animate-spin" />

                                                                ) : (

                                                                    <Trash2 className="w-4 h-4" />

                                                                )}

                                                            </button>

                                                        )}

                                                    </div>

                                                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">

                                                        {reply.content}

                                                    </p>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            )}

                            {/* ==================================================
                                ERROR
                            ================================================== */}

                            {replyError && (

                                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">

                                    {replyError}

                                </div>

                            )}

                            {/* ==================================================
                                REPLY FORM
                            ================================================== */}

                            <form
                                onSubmit={
                                    handleReplySubmit
                                }
                            >

                                <div className="flex gap-3">

                                    <textarea
                                        value={
                                            replyText
                                        }
                                        onChange={(event) =>
                                            setReplyText(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Write a reply..."
                                        rows={2}
                                        maxLength={2000}
                                        disabled={
                                            submittingReply
                                        }
                                        className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            submittingReply ||
                                            !replyText.trim()
                                        }
                                        className="self-end inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-4 py-3 rounded-xl transition"
                                    >

                                        {submittingReply ? (

                                            <Loader2 className="w-4 h-4 animate-spin" />

                                        ) : (

                                            <Send className="w-4 h-4" />

                                        )}

                                        <span className="hidden sm:inline">

                                            Reply

                                        </span>

                                    </button>

                                </div>

                            </form>

                        </>

                    )}

                </div>

            )}

        </article>
    );
}

// ======================================================
// DATE FORMATTER
// ======================================================

function formatDate(timestamp) {

    try {

        if (!timestamp) {
            return "";
        }

        const date =
            timestamp?.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );

    } catch {

        return "";
    }
}

export default ChatboardPost;

