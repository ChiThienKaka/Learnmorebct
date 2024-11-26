import {VietQR} from 'vietqr';

export const vietQR = new VietQR({
    clientID: '3c8607ab-a7a5-4770-84ab-1adb7e1be4c3',
    apiKey: 'b329149c-7625-4dcb-aa98-852dccb52178',
});

export const getnganhang = async(nganhang:string) => {
    vietQR.getBanks().then((banks:any)=>{
        const bank = banks.data.find((item:any)=>item.code === nganhang);
        if(bank){
            return bank;
        }else{
            return null;
        }
    })
}

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
