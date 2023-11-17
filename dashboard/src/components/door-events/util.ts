export const formatDayPercentage = (day: string, val: number, totalVal: number) => {
    return `${day} - ${Math.trunc(val / totalVal * 100)}%`
}

export const formatMsToMinutes = (time: number) => {
    return Math.trunc(time / 1000 / 60);
}