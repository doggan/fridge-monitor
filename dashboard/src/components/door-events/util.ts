export const formatDayPercentage = (day: string, val: number, totalVal: number) => {
    if (totalVal === 0) {
        return day;
    }

    return `${day} - ${Math.trunc(val / totalVal * 100)}%`
}

export const formatMsToMinutes = (time: number) => {
    return Math.trunc(time / 1000 / 60);
}