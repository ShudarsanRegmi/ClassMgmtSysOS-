// dtos/event.dto.js

function eventDto(event) {
    if (!event) return null;

    return {
        id: event._id,
        title: event.title,
        date: event.date,
        caption: event.caption,
        tags: event.tags,
        images: event.images,
        classId: event.classId,
        semesterId: event.semesterId,
        postedBy: event.postedBy,
        likes: event.likes,
        comments: event.comments,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        likeCount: event.likes?.length || 0,
        commentCount: event.comments?.length || 0
    };
}

// Lighter version for listing events
function eventListDto(event) {
    if (!event) return null;

    return {
        id: event._id,
        title: event.title,
        date: event.date,
        caption: event.caption,
        tags: event.tags,
        images: event.images.slice(0, 1), // Only first image for preview
        classId: event.classId,
        semesterId: event.semesterId,
        postedBy: event.postedBy,
        likeCount: event.likes?.length || 0,
        commentCount: event.comments?.length || 0,
        createdAt: event.createdAt
    };
}

module.exports = {
    eventDto,
    eventListDto
}; 