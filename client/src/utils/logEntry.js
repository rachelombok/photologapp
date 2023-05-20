export const calculateTimeDifference = (postDate, currentDate) => {
    postDate = new Date(postDate);
    const seconds = (currentDate.getTime() - postDate.getTime()) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    if (weeks > 4) return postDate.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
    if (weeks >= 1) return `${Math.abs(Math.round(weeks))} week${weeks > 1 ? 's' : ''} ago`;
    if (1 < days && days < 7) return `${Math.abs(Math.round(days))} day${days > 1 ? 's' : ''} ago`;
    if (1 < hours && hours < 24) return `${Math.abs(Math.round(hours))} hour${hours > 1 ? 's' : ''} ago`;
    if (1 < minutes && minutes < 60) return `${Math.abs(Math.round(minutes))} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds < 60) return `${Math.abs(Math.round(seconds))} second${seconds > 1 ? 's' : ''} ago`;
}

export const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

export const calculateCommentTimeDifference = (postDate, currentDate) => {
    postDate = new Date(postDate);
    const seconds = (currentDate.getTime() - postDate.getTime()) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    if (weeks >= 1) return `${Math.abs(Math.round(weeks))}w`;
    if (1 < days && days < 7) return `${Math.abs(Math.round(days))}d`;
    if (1 < hours && hours < 24) return `${Math.abs(Math.round(hours))}h`;
    if (1 < minutes && minutes < 60) return `${Math.abs(Math.round(minutes))}m`;
    if (seconds < 60) return `${Math.abs(Math.round(seconds))}s`;
}