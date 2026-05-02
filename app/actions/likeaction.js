"use server"

import { auth } from "@/lib/schemas/auth"
import prisma from "@/lib/prisma"

export async function toggleLikeMember(targetUserId, isLiked) {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }
        const sourceUserId = session.user.id
        if (sourceUserId === targetUserId) {
            return { error: "You cannot like yourself" }
        }

        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId,
                        targetUserId,
                    },
                },
            })
        } else {
            await prisma.like.create({
                data: {
                    sourceUserId,
                    targetUserId,
                },
            })
        }
        return { success: true, data: isLiked ? "Unliked" : "Liked" }
    } catch (error) {
        throw error
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }
        const likes = await prisma.like.findMany({
            where: {
                sourceUserId: session.user.id,
            },
            select: {
                targetUserId: true,
            },
        })
        return likes.map(like => like.targetUserId);
    } catch (error) {
        throw error;
    }
}


export async function fetchLikedMembers(type = "source") {
    try {
        const session = await auth()
        if (!session?.user) {
            return { error: "Unauthorized" }
        }
        switch (type) {
            case "source":
                const sourceLikes = await fetchSourceLikes(session.user.id)
                return sourceLikes;
            case "target":
                const targetLikes = await fetchTargetLikes(session.user.id)
                return targetLikes;
            case "mutual":
                const mutualLikes = await fetchMutualLikes(session.user.id)
                return mutualLikes;
            default:
                return [];
        }

    } catch (error) {
        throw error;
    }
}


async function fetchSourceLikes(sourceUserId) {
    try {
        const sourceLikes = await prisma.like.findMany({
            where: {
                sourceUserId: sourceUserId,
            },
            include: {
                targetMember: true,
            },
        })
        return sourceLikes.map(like => like.targetMember);
    } catch (error) {
        throw error;
    }
}

async function fetchTargetLikes(targetUserId) {
    try {
        const targetLikes = await prisma.like.findMany({
            where: {
                targetUserId: targetUserId,
            },
            include: {
                sourceMember: true,
            },
        })
        return targetLikes.map(like => like.sourceMember);
    } catch (error) {
        throw error;
    }
}

async function fetchMutualLikes(sourceUserId) {
    try {
        const likedusers = await prisma.like.findMany({
            where: {
                sourceUserId: sourceUserId,
            },
            select: {
                targetUserId: true,
            },
        })
        const likedIds = likedusers.map(like => like.targetUserId);
        const mutualLikes = await prisma.like.findMany({
            where: {
                AND: [
                    { targetUserId: sourceUserId },
                    { sourceUserId: { in: likedIds } },
                ],
            },
            select: {
                sourceMember: true,
            },
        })
        return mutualLikes.map(like => like.sourceMember);
    } catch (error) {
        throw error;
    }
}