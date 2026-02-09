// 配置文件 - 請將您的 Google Apps Script Web App URL 填入下方
const CONFIG = {
    // 部署 GAS 後，將獲得的 URL 貼到這裡
    // 格式範例: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
    GAS_URL: 'https://script.google.com/macros/s/AKfycbzkxeJfBK9R0GUrNwt2VI6alpBt8heotlcilNxww4s8BAyqr51WveLxhAgv9fskYnuuZw/exec'
};

// 驗證配置
if (CONFIG.GAS_URL === 'YOUR_GAS_WEB_APP_URL_HERE') {
    console.warn('⚠️ 請先在 config.js 中設置您的 Google Apps Script URL');
}
