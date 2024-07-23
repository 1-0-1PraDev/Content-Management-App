export const truncateText = (text, charsCount, dotStr) => {
    return text.slice(0, charsCount) + (text.length > 0 ? dotStr : "");
}