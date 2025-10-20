export function formatNumberLocale(num, locale = 'vi-VN') {
    if (num === null || num === undefined || isNaN(num)) return "0";
    return new Intl.NumberFormat(locale).format(num);
}