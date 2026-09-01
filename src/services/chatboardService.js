import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
} from "firebase/firestore";

import {
    auth,
    db,
} from "../firebase/firebase";

// ======================================================
// CHATBOARD COLLECTION
// ======================================================

const CHATBOARD_COLLECTION =
    "chatboardPosts";

// ======================================================
// CREATE POST
// ======================================================

export async function createChatboardPost({
    authorId,
    authorName,
    title,
    content,
    category = "General",
}) {

    if (!authorId) {

        throw new Error(
            "User authentication is required."
        );
    }

    if (!title?.trim()) {

        throw new Error(
            "Post title is required."
        );
    }

    if (!content?.trim()) {

        throw new Error(
            "Post content is required."
        );
    }

    const post = {

        authorId,

        authorName:
            authorName?.trim() ||
            "CareerOS User",

        title:
            title.trim(),

        content:
            content.trim(),

        category:
            category?.trim() ||
            "General",

        likes: 0,

        createdAt:
            serverTimestamp(),

        updatedAt:
            serverTimestamp(),

    };

    const postRef =
        await addDoc(
            collection(
                db,
                CHATBOARD_COLLECTION
            ),
            post
        );

    return {

        id:
            postRef.id,

        ...post,

    };
}

// ======================================================
// GET POSTS
// ======================================================

export async function getChatboardPosts(
    maxPosts = 50
) {

    const postsQuery =
        query(
            collection(
                db,
                CHATBOARD_COLLECTION
            ),
            orderBy(
                "createdAt",
                "desc"
            ),
            limit(maxPosts)
        );

    const snapshot =
        await getDocs(
            postsQuery
        );

    return snapshot.docs.map(
        (document) => ({

            id:
                document.id,

            ...document.data(),

        })
    );
}

// ======================================================
// LIKE / DISLIKE POST
// ======================================================
//
// First click:
//   Like
//   likes + 1
//   /likes/{userId} created
//
// Second click:
//   Dislike
//   likes - 1
//   /likes/{userId} deleted
//
// ======================================================

export async function likeChatboardPost(
    postId,
    userId
) {

    if (!postId) {

        throw new Error(
            "Post ID is required."
        );
    }

    if (!userId) {

        throw new Error(
            "User authentication is required."
        );
    }

    const currentUser =
        auth.currentUser;

    if (
        !currentUser ||
        currentUser.uid !== userId
    ) {

        throw new Error(
            "Please sign in before liking this discussion."
        );
    }

    const postRef =
        doc(
            db,
            CHATBOARD_COLLECTION,
            postId
        );

    const likeRef =
        doc(
            db,
            CHATBOARD_COLLECTION,
            postId,
            "likes",
            userId
        );

    return await runTransaction(
        db,
        async (transaction) => {

            const postSnapshot =
                await transaction.get(
                    postRef
                );

            const likeSnapshot =
                await transaction.get(
                    likeRef
                );

            if (
                !postSnapshot.exists()
            ) {

                throw new Error(
                    "Discussion no longer exists."
                );
            }

            const currentLikes =
                Number(
                    postSnapshot
                        .data()
                        ?.likes || 0
                );

            // ==================================================
            // DISLIKE
            // ==================================================

            if (
                likeSnapshot.exists()
            ) {

                const newLikes =
                    Math.max(
                        0,
                        currentLikes - 1
                    );

                transaction.delete(
                    likeRef
                );

                transaction.update(
                    postRef,
                    {

                        likes:
                            newLikes,

                        updatedAt:
                            serverTimestamp(),

                    }
                );

                return {

                    liked: false,

                    unliked: true,

                    alreadyLiked: false,

                    likes:
                        newLikes,

                };
            }

            // ==================================================
            // LIKE
            // ==================================================

            const newLikes =
                currentLikes + 1;

            transaction.set(
                likeRef,
                {

                    userId,

                    createdAt:
                        serverTimestamp(),

                }
            );

            transaction.update(
                postRef,
                {

                    likes:
                        newLikes,

                    updatedAt:
                        serverTimestamp(),

                }
            );

            return {

                liked: true,

                unliked: false,

                alreadyLiked: false,

                likes:
                    newLikes,

            };
        }
    );
}

// ======================================================
// CHECK WHETHER USER LIKED POST
// ======================================================

export async function hasLikedChatboardPost(
    postId,
    userId
) {

    if (
        !postId ||
        !userId
    ) {

        return false;
    }

    const likeRef =
        doc(
            db,
            CHATBOARD_COLLECTION,
            postId,
            "likes",
            userId
        );

    const snapshot =
        await getDoc(
            likeRef
        );

    return snapshot.exists();
}

// ======================================================
// DELETE POST
// ======================================================
//
// Deletes a Chatboard post.
//
// The Firebase Authentication UID is checked locally,
// and Firestore security rules perform the final
// authorization check.
//
// IMPORTANT:
// We intentionally DO NOT call getDoc() after deleteDoc().
//
// Firestore may return a cached document during an immediate
// verification read. That can make a successful deletion
// appear to have failed and cause the frontend to restore
// the post.
//
// deleteDoc() resolving successfully is sufficient.
// ======================================================

export async function deleteChatboardPost(
    postId,
    userId
) {

    // ==================================================
    // POST ID CHECK
    // ==================================================

    if (!postId) {

        throw new Error(
            "Post ID is required."
        );
    }

    // ==================================================
    // CURRENT AUTH USER
    // ==================================================

    const currentUser =
        auth.currentUser;

    if (!currentUser) {

        throw new Error(
            "Please sign in before deleting this discussion."
        );
    }

    // ==================================================
    // AUTHENTICATED UID
    // ==================================================

    const authenticatedUid =
        currentUser.uid;

    // ==================================================
    // USER ID CHECK
    // ==================================================

    if (
        userId &&
        authenticatedUid !== userId
    ) {

        throw new Error(
            "Your account does not match the signed-in user."
        );
    }

    // ==================================================
    // POST REFERENCE
    // ==================================================

    const postRef =
        doc(
            db,
            CHATBOARD_COLLECTION,
            postId
        );

    // ==================================================
    // CHECK POST EXISTS
    // ==================================================

    const postSnapshot =
        await getDoc(
            postRef
        );

    if (!postSnapshot.exists()) {

        throw new Error(
            "Discussion no longer exists."
        );
    }

    // ==================================================
    // GET POST DATA
    // ==================================================

    const postData =
        postSnapshot.data();

    // ==================================================
    // OWNER CHECK
    // ==================================================
    //
    // This is an additional frontend/service check.
    //
    // Firestore rules remain the final authority.
    //
    // ==================================================

    if (
        postData.authorId !==
        authenticatedUid
    ) {

        throw new Error(
            "You can only delete your own discussions."
        );
    }

    // ==================================================
    // LOG DELETE REQUEST
    // ==================================================

    

    // ==================================================
    // DELETE POST
    // ==================================================

    await deleteDoc(
        postRef
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    

    return {

        deleted: true,

        postId,

    };
}
// ======================================================
// CREATE REPLY
// ======================================================

export async function createChatboardReply({
    postId,
    authorId,
    authorName,
    content,
}) {

    if (!postId) {

        throw new Error(
            "Post ID is required."
        );
    }

    if (!authorId) {

        throw new Error(
            "User authentication is required."
        );
    }

    if (!content?.trim()) {

        throw new Error(
            "Reply content is required."
        );
    }

    const reply = {

        authorId,

        authorName:
            authorName?.trim() ||
            "CareerOS User",

        content:
            content.trim(),

        createdAt:
            serverTimestamp(),

    };

    const replyRef =
        await addDoc(
            collection(
                db,
                CHATBOARD_COLLECTION,
                postId,
                "replies"
            ),
            reply
        );

    return {

        id:
            replyRef.id,

        ...reply,

    };
}

// ======================================================
// GET REPLIES
// ======================================================

export async function getChatboardReplies(
    postId
) {

    if (!postId) {

        throw new Error(
            "Post ID is required."
        );
    }

    const repliesQuery =
        query(
            collection(
                db,
                CHATBOARD_COLLECTION,
                postId,
                "replies"
            ),
            orderBy(
                "createdAt",
                "asc"
            )
        );

    const snapshot =
        await getDocs(
            repliesQuery
        );

    return snapshot.docs.map(
        (document) => ({

            id:
                document.id,

            ...document.data(),

        })
    );
}

// ======================================================
// DELETE REPLY
// ======================================================

export async function deleteChatboardReply(
    postId,
    replyId
) {

    if (
        !postId ||
        !replyId
    ) {

        throw new Error(
            "Post ID and reply ID are required."
        );
    }

    await deleteDoc(
        doc(
            db,
            CHATBOARD_COLLECTION,
            postId,
            "replies",
            replyId
        )
    );

    return {

        deleted: true,

        replyId,

    };
}