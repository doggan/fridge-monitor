export const getDateWithZeroPadding = (date: Date) => {
    // Note: this currently using the user's local time. If we ever
    // want to display times in 'refrigerator' local time, we'll need to account
    // for timezones.
    return date.getFullYear() + '-' +
        ('0' + (date.getMonth()+1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2);
}
