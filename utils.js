// 共用工具函數

// 格式化日期為 YYYY-MM-DD
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 格式化金額為台幣格式（四捨五入，不顯示小數）
function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') return 'NT$ 0';
    const num = parseFloat(amount);
    if (isNaN(num)) return 'NT$ 0';
    return 'NT$ ' + Math.round(num).toLocaleString();
}

// 生成唯一 ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 顯示載入遮罩
function showLoading(message = '處理中...') {
    let loadingDiv = document.getElementById('loadingOverlay');
    if (!loadingDiv) {
        loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingOverlay';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        `;
        document.body.appendChild(loadingDiv);
    } else {
        loadingDiv.querySelector('.loading-text').textContent = message;
    }
    loadingDiv.style.display = 'flex';
}

// 隱藏載入遮罩
function hideLoading() {
    const loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
        loadingDiv.style.display = 'none';
    }
}

// 顯示提示訊息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 觸發動畫
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 2秒後移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 顯示確認對話框
function showConfirm(message) {
    return confirm(message);
}

// API 請求封裝
async function apiRequest(action, data = {}) {
    if (!CONFIG.GAS_URL || CONFIG.GAS_URL === 'YOUR_GAS_WEB_APP_URL_HERE') {
        throw new Error('請先在 config.js 中設置 Google Apps Script URL');
    }

    try {
        // 將數據轉為 URL 參數
        const params = new URLSearchParams();
        params.append('action', action);
        
        // 將數據序列化為 JSON 字符串
        if (Object.keys(data).length > 0) {
            params.append('data', JSON.stringify(data));
        }
        
        const url = `${CONFIG.GAS_URL}?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow'
        });

        const text = await response.text();
        
        let result;
        try {
            result = JSON.parse(text);
        } catch (e) {
            console.error('無法解析響應:', text);
            throw new Error('伺服器響應格式錯誤');
        }
        
        if (!result.success) {
            throw new Error(result.message || '操作失敗');
        }
        
        return result.data;
    } catch (error) {
        console.error('API 請求錯誤:', error);
        throw error;
    }
}

// 驗證表單必填項
function validateRequired(formData, requiredFields) {
    const missing = [];
    
    for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
            missing.push(field);
        }
    }
    
    return missing;
}

// 添加全域樣式（載入遮罩、提示訊息）
function addGlobalStyles() {
    if (document.getElementById('globalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'globalStyles';
    style.textContent = `
        /* 載入遮罩 */
        #loadingOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            z-index: 9999;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        .loading-text {
            color: white;
            margin-top: 20px;
            font-size: 1rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* 提示訊息 */
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
            z-index: 10000;
            max-width: 400px;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        .toast-success {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }

        .toast-error {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }

        .toast-warning {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        }

        .toast-info {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }
    `;
    document.head.appendChild(style);
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    addGlobalStyles();
});
