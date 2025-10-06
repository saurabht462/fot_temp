export const formatDuration = (start: Date | null, end: Date): string => {
    if (!start) return '00:00:00';
    const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
    const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
    const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
    const secs = (diff % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};
