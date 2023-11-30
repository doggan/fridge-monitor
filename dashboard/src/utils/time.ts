import dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'

// @ts-ignore
dayjs.extend(relativeTime);

export const getDateWithZeroPadding = (date: Date) => {
    // Note: this currently using the user's local time. If we ever
    // want to display times in 'refrigerator' local time, we'll need to account
    // for timezones.
    return date.getFullYear() + '-' +
        ('0' + (date.getMonth()+1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2);
}

/**
 * Returns the formatted "XXX months/days/hours/etc ago" string
 */
export const timeAgo = (date: Date) => {
    return dayjs().to(date);
}