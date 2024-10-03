export const API_URL = 'http://localhost:5000/';

export const formatCurrencyVND = (amount:any) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
//chuyển sang ngày giờ việt nam
export const formatToVietnamTime = (isoString:any) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',  // Múi giờ Việt Nam
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};