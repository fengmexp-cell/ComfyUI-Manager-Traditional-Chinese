/******************************************************************
 * ComfyUI-Manager 繁體中文直覺引擎 Pro Max v2.1 (峰哥實戰版)
 * --------------------------------------------------------------
 * 更新：1. 支援包含式匹配 2. 專門處理 select/option 3. 增加錯誤訊息詞庫
 ******************************************************************/
(function() {
    const zh_tw_map = {
        // --- 原有的 ---
        "Share": "分享成果",
        "Install Custom Nodes": "安裝新插件 (擴充功能)",
        "Install Missing Custom Nodes": "安裝缺少的節點",
        "Custom Nodes In Workflow": "目前工作流用的插件",
        "Update All": "全部更新到最新",
        "Fetch Updates": "檢查有沒有更新",
        "Install Models": "下載 AI 模型",
        "Update ComfyUI": "更新 ComfyUI 主程式",
        "Manager": "管理器主頁",
        "Custom Nodes Manager": "插件大管家",
        "Model Manager": "模型管理員",
        "Restart": "立即重新啟動",
        "Workflow Gallery": "工作流展示廳",
        "Community Manual": "社群說明書",
        "Nodes Info": "節點詳細資料",
        "Used In Workflow": "工作流正在用",
        "Check Update": "檢查更新",
        "Check Missing": "檢查缺失",
        "Install via Git URL": "用 Git 網址安裝",
        "Filter": "篩選搜尋",
        "Search": "搜尋",
        "Description": "說明",
        "Version": "版本",
        "Action": "操作",
        "Author": "作者",
        "Last Update": "最後更新",
        "Try update": "嘗試更新",
        "Install": "安裝",
        "Uninstall": "解除安裝",
        "Update": "更新",
        "Size": "大小",
        "Type": "類型",
        "Base": "基底模型",
        "Save Path": "儲存路徑",
        "No Results": "查無結果",
        "EXPERIMENTAL": "不懂別亂點",
        "Snapshot Manager": "快照備份管理",
        "Install PIP packages": "安裝 Python 套件",
        "Please enter the URL of the Git repository to install": "請貼上要安裝的 Git 倉庫網址",
        "Confirm": "確定",
        "OK": "好",
        "Close": "關閉",
        "Cancel": "取消",
        "ID": "編號",
        "Title": "名稱",
        "Nodes": "節點數",
        
        // --- v2.1 新增：錯誤訊息 & 彈窗 ---
        "Failed to load": "載入失敗",
        "Failed to load graph": "載入子圖藍圖失敗",
        "Please enumerate the pip packages to be installed. Example: insightface opencv-python-headless>=4.1.1": "請輸入要安裝的 pip 套件名稱，例如：insightface opencv-python-headless>=4.1.1",
        "Example: insightface opencv-python-headless>=4.1.1": "範例：insightface opencv-python-headless>=4.1.1",
    };

    // --- 包含式匹配：只要包含關鍵字就翻，解決 Workflow Gallery (openart.ai) ---
    const includes_map = [
        ["Workflow Gallery", "工作流展示廳"],
        ["Community Manual", "社群說明書"],
        ["Failed to load graph", "載入子圖藍圖失敗"],
        ["Failed to load", "載入失敗"],
        ["Please enumerate the pip packages", "請輸入要安裝的 pip 套件名稱"],
    ];

    const regex_map = [
        [/^Update \((\d+)\)$/, '更新 ($1)'],
        [/^Install (\d+)\/(\d+)$/, '安裝 $1/$2'],
        [/^(\d+) nodes$/, '$1 個節點'],
        [/^(\d+) models$/, '$1 個模型'],
        [/^Failed to load graph x(\d+)$/, '載入子圖藍圖失敗 x$1'], // 處理你截圖那個 x16
    ];

    function debounce(fn, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        }
    }

    function translateText(txt) {
        txt = txt.trim();
        if (!txt) return txt;

        // 1. 精準匹配
        if (zh_tw_map[txt]) return zh_tw_map[txt];

        // 2. 正則匹配
        for (const [regex, replacement] of regex_map) {
            if (regex.test(txt)) return txt.replace(regex, replacement);
        }

        // 3. 包含式匹配：解決 Workflow Gallery (openart.ai)
        for (const [key, val] of includes_map) {
            if (txt.includes(key)) return txt.replace(key, val);
        }

        return txt;
    }

    function translateNode(root) {
        // 用 * 選擇器暴力掃，連 select option 都不放過
        root.querySelectorAll('*').forEach(el => {
            // 跳過 script style
            if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(el.tagName)) return;

            // 處理純文字節點
            for (const node of el.childNodes) {
                if (node.nodeType === 3) { // TEXT_NODE
                    const newTxt = translateText(node.nodeValue);
                    if (newTxt !== node.nodeValue) node.nodeValue = newTxt;
                }
            }

            // 處理屬性
            if (el.placeholder) el.placeholder = translateText(el.placeholder);
            if (el.title) el.title = translateText(el.title);
            if (el.tagName === 'OPTION' && el.textContent) {
                el.textContent = translateText(el.textContent);
            }
        });
    }

    const runTranslate = debounce(() => {
        translateNode(document.body);
    }, 100);

    const observer = new MutationObserver(runTranslate);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title'] // 監聽屬性變化
    });

    setTimeout(runTranslate, 800); // ComfyUI 初始化比較慢，延遲久一點

    console.log("%c🔥 峰哥 Pro Max v2.1：包含式匹配+Option修復版上線", "color:#FF6D00; font-size:14px; font-weight:bold;");
    console.log("%c🎯 專治 Workflow Gallery (openart.ai) 各種疑難雜症", "color:#FF6D00");
})();
