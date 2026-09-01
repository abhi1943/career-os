
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    MessageSquare,
    Users,
    Sparkles,
} from "lucide-react";

import {
    onAuthStateChanged,
} from "firebase/auth";

import {
    auth,
} from "../../firebase/firebase";

import ChatboardComposer
    from "../../components/chatboard/ChatboardComposer";

import ChatboardFilters
    from "../../components/chatboard/ChatboardFilters";

import ChatboardPost
    from "../../components/chatboard/ChatboardPost";

import {
    createChatboardPost,
    getChatboardPosts,
    likeChatboardPost,
    deleteChatboardPost,
} from "../../services/chatboardService";

// ======================================================
// CHATBOARD
// ======================================================

function Chatboard() {

    // ======================================================
    // STATE
    // ======================================================

    const [posts, setPosts] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("All");

    const [submitting, setSubmitting] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [user, setUser] =
        useState(null);

    // ======================================================
    // DELETED POST IDS
    // ======================================================
    //
    // IMPORTANT:
    //
    // This prevents a deleted post from being re-added when
    // an older getChatboardPosts() request finishes later.
    //
    // ======================================================

    const deletedPostIdsRef =
        useRef(new Set());

    // ======================================================
    // AUTHENTICATION
    // ======================================================

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {

                    

                    setUser(
                        currentUser
                    );
                }
            );

        return unsubscribe;

    }, []);

    // ======================================================
    // LOAD POSTS
    // ======================================================

    useEffect(() => {

        let mounted = true;

        const loadPosts =
            async () => {

                setLoading(true);
                setError("");

                try {

                    const loadedPosts =
                        await getChatboardPosts(
                            50
                        );

                    if (!mounted) {
                        return;
                    }

                    const safePosts =
                        Array.isArray(
                            loadedPosts
                        )
                            ? loadedPosts.filter(
                                (post) =>
                                    post?.id &&
                                    !deletedPostIdsRef
                                        .current
                                        .has(
                                            String(
                                                post.id
                                            )
                                        )
                            )
                            : [];

                    setPosts(
                        safePosts
                    );

                } catch (loadError) {

                    console.error(
                        "🔥 CHATBOARD LOAD ERROR:",
                        loadError
                    );

                    if (mounted) {

                        setError(
                            loadError?.message ||
                            "Unable to load discussions. Please try again."
                        );
                    }

                } finally {

                    if (mounted) {
                        setLoading(false);
                    }
                }
            };

        loadPosts();

        return () => {
            mounted = false;
        };

    }, []);

    // ======================================================
    // FILTER POSTS
    // ======================================================

    const filteredPosts =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return posts.filter(
                (post) => {

                    const matchesCategory =
                        category === "All" ||
                        post.category === category;

                    const matchesSearch =
                        !normalizedSearch ||
                        post.title
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        post.content
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    return (
                        matchesCategory &&
                        matchesSearch
                    );
                }
            );

        }, [
            posts,
            search,
            category,
        ]);

    // ======================================================
    // CREATE POST
    // ======================================================

    const handleCreatePost =
        async (postData) => {

            const activeUser =
                auth.currentUser ||
                user ||
                null;

            if (!activeUser) {

                setError(
                    "Please sign in before creating a discussion."
                );

                return false;
            }

            setSubmitting(true);
            setError("");

            try {

                const newPost =
                    await createChatboardPost({

                        authorId:
                            activeUser.uid,

                        authorName:
                            activeUser.displayName ||
                            "CareerOS User",

                        title:
                            postData.title,

                        content:
                            postData.content,

                        category:
                            postData.category ||
                            "General",
                    });

                if (
                    newPost?.id
                ) {

                    // Make sure a newly created post is not
                    // incorrectly treated as deleted.

                    deletedPostIdsRef
                        .current
                        .delete(
                            String(
                                newPost.id
                            )
                        );
                }

                setPosts(
                    (previousPosts) => [

                        {
                            ...newPost,

                            createdAt:
                                newPost.createdAt ||
                                new Date(),

                            replies: [],
                        },

                        ...previousPosts,

                    ]
                );

                return true;

            } catch (createError) {

                console.error(
                    "🔥 CHATBOARD CREATE ERROR:",
                    createError
                );

                setError(
                    createError?.message ||
                    "Unable to create the discussion. Please try again."
                );

                return false;

            } finally {

                setSubmitting(false);
            }
        };

    // ======================================================
    // LIKE / DISLIKE
    // ======================================================

    const handleLike =
        async (
            post,
            userId
        ) => {

            setError("");

            const activeUser =
                auth.currentUser ||
                user ||
                null;

            if (
                !activeUser ||
                !userId ||
                activeUser.uid !== userId
            ) {

                setError(
                    "Please sign in before liking this discussion."
                );

                return {

                    liked: false,

                    unliked: false,

                    alreadyLiked: false,
                };
            }

            try {

                

                const result =
                    await likeChatboardPost(
                        post.id,
                        userId
                    );

                // ==================================================
                // LIKE
                // ==================================================

                if (
                    result?.liked
                ) {

                    setPosts(
                        (previousPosts) =>
                            previousPosts.map(
                                (item) =>
                                    item.id ===
                                    post.id
                                        ? {
                                            ...item,

                                            likes:
                                                result.likes ??
                                                Number(
                                                    item.likes ||
                                                    0
                                                ) + 1,
                                        }
                                        : item
                            )
                    );

                    return result;
                }

                // ==================================================
                // DISLIKE
                // ==================================================

                if (
                    result?.unliked
                ) {

                    setPosts(
                        (previousPosts) =>
                            previousPosts.map(
                                (item) =>
                                    item.id ===
                                    post.id
                                        ? {
                                            ...item,

                                            likes:
                                                result.likes ??
                                                Math.max(
                                                    0,
                                                    Number(
                                                        item.likes ||
                                                        0
                                                    ) - 1
                                                ),
                                        }
                                        : item
                            )
                    );

                    return result;
                }

                return result;

            } catch (likeError) {

                console.error(
                    "🔥 CHATBOARD LIKE ERROR:",
                    likeError
                );

                setError(
                    likeError?.message ||
                    "Unable to update this discussion."
                );

                return {

                    liked: false,

                    unliked: false,

                    alreadyLiked: false,

                    error:
                        likeError,
                };
            }
        };

    // ======================================================
    // DELETE POST
    // ======================================================
    //
    // IMPORTANT FIX:
    //
    // The deleted post ID is stored in deletedPostIdsRef
    // BEFORE the Firestore request.
    //
    // Therefore even if an old getChatboardPosts()
    // request finishes afterwards, it cannot put the
    // deleted post back into React state.
    //
    // ======================================================

    const handleDelete =
        async (
            post,
            userId
        ) => {

            setError("");

            // ==================================================
            // GET CURRENT AUTH USER
            // ==================================================

            const activeUser =
                auth.currentUser ||
                user ||
                null;

            // ==================================================
            // AUTH CHECK
            // ==================================================

            if (!activeUser) {

                setError(
                    "Please sign in before deleting this discussion."
                );

                return false;
            }

            // ==================================================
            // POST ID CHECK
            // ==================================================

            if (!post?.id) {

                setError(
                    "Unable to delete this discussion because the post ID is missing."
                );

                return false;
            }

            // ==================================================
            // USER ID CHECK
            // ==================================================

            if (
                userId &&
                activeUser.uid !== userId
            ) {

                setError(
                    "Your account does not match the signed-in user."
                );

                return false;
            }

            // ==================================================
            // OWNER CHECK
            // ==================================================

            if (
                !post?.authorId ||
                post.authorId !==
                    activeUser.uid
            ) {

                setError(
                    "You can only delete your own discussions."
                );

                return false;
            }

            const deletedPost =
                post;

            const deletedPostId =
                String(
                    deletedPost.id
                );

            // ==================================================
            // MARK AS DELETED IMMEDIATELY
            // ==================================================
            //
            // This is intentionally done BEFORE the Firestore
            // request.
            //
            // ==================================================

            deletedPostIdsRef
                .current
                .add(
                    deletedPostId
                );

            

            // ==================================================
            // REMOVE FROM UI IMMEDIATELY
            // ==================================================

            setPosts(
                (previousPosts) =>
                    previousPosts.filter(
                        (item) =>
                            String(
                                item?.id
                            ) !==
                            deletedPostId
                    )
            );

            

            // ==================================================
            // DELETE FROM FIRESTORE
            // ==================================================

            try {

                

                const deleteResult =
                    await deleteChatboardPost(
                        deletedPost.id,
                        activeUser.uid
                    );

                console.log(
                    "✅ CHATBOARD FIRESTORE DELETE SUCCESS:",
                    deleteResult
                );

                // ==================================================
                // FINAL UI SAFETY CHECK
                // ==================================================
                //
                // Even after successful Firestore deletion,
                // guarantee that this post is not present in
                // the current React state.
                //
                // ==================================================

                setPosts(
                    (previousPosts) =>
                        previousPosts.filter(
                            (item) =>
                                String(
                                    item?.id
                                ) !==
                                deletedPostId
                        )
                );

                

                return true;

            } catch (deleteError) {

                console.error(
                    "🔥 CHATBOARD DELETE ERROR:",
                    deleteError
                );

                // ==================================================
                // DELETE FAILED
                // ==================================================
                //
                // Remove the ID from the deleted set because the
                // Firestore deletion failed.
                //
                // ==================================================

                deletedPostIdsRef
                    .current
                    .delete(
                        deletedPostId
                    );

                // ==================================================
                // RESTORE POST
                // ==================================================

                setPosts(
                    (previousPosts) => {

                        const alreadyExists =
                            previousPosts.some(
                                (item) =>
                                    String(
                                        item?.id
                                    ) ===
                                    deletedPostId
                            );

                        if (
                            alreadyExists
                        ) {
                            return previousPosts;
                        }

                        return [
                            deletedPost,
                            ...previousPosts,
                        ];
                    }
                );

                setError(
                    deleteError?.message ||
                    "Unable to delete this discussion."
                );

                return false;
            }
        };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100">

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

                <div className="max-w-7xl mx-auto px-6 py-12">

                    <div className="max-w-3xl">

                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-5">

                            <Sparkles className="w-4 h-4" />

                            CareerOS Community

                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold">

                            CareerOS Chatboard

                        </h1>

                        <p className="text-blue-100 text-lg mt-4 leading-relaxed">

                            Connect with students, ask career questions,
                            share experiences, and help others on their
                            career journey.

                        </p>

                        <div className="flex flex-wrap gap-6 mt-7 text-sm">

                            <div className="flex items-center gap-2">

                                <MessageSquare className="w-5 h-5" />

                                Community Discussions

                            </div>

                            <div className="flex items-center gap-2">

                                <Users className="w-5 h-5" />

                                Student Community

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">

                        {error}

                    </div>

                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ==================================================
                        DISCUSSIONS
                    ================================================== */}

                    <section className="lg:col-span-2 space-y-6">

                        <ChatboardFilters
                            search={
                                search
                            }

                            category={
                                category
                            }

                            onSearchChange={
                                setSearch
                            }

                            onCategoryChange={
                                setCategory
                            }
                        />

                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading ? (

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

                                <div className="w-10 h-10 mx-auto border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

                                <h2 className="text-xl font-bold text-slate-900 mt-5">

                                    Loading discussions...

                                </h2>

                                <p className="text-slate-500 mt-2">

                                    Fetching the latest CareerOS community posts.

                                </p>

                            </div>

                        ) : filteredPosts.length === 0 ? (

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

                                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">

                                    <MessageSquare
                                        className="w-8 h-8 text-blue-600"
                                    />

                                </div>

                                <h2 className="text-xl font-bold text-slate-900 mt-5">

                                    No discussions yet

                                </h2>

                                <p className="text-slate-500 mt-2 max-w-md mx-auto">

                                    Be the first to start a discussion
                                    and help build the CareerOS student
                                    community.

                                </p>

                            </div>

                        ) : (

                            filteredPosts.map(
                                (post) => (

                                    <ChatboardPost
                                        key={
                                            post.id
                                        }

                                        post={
                                            post
                                        }

                                        currentUser={
                                            user
                                        }

                                        onLike={
                                            handleLike
                                        }

                                        onDeletePost={handleDelete}
                                    />

                                )
                            )

                        )}

                    </section>

                    {/* ==================================================
                        COMPOSER
                    ================================================== */}

                    <aside>

                        <div className="lg:sticky lg:top-24">

                            <ChatboardComposer
                                onSubmit={
                                    handleCreatePost
                                }

                                submitting={
                                    submitting
                                }
                            />

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default Chatboard;

