/******************************************************************
 * ComfyUI-Manager 简体中文直觉引擎 Pro Max v2.1 (峰哥实战版)
 * --------------------------------------------------------------
 * 技术架构：Gemini AI / 实战监制：峰哥 (Feng) / 优化：Muse Spark
 * --------------------------------------------------------------
 * v2.1 更新：1. 包含式匹配 2. 正则匹配 3. select/option修复
 ******************************************************************/
(function() {
    const zh_cn_map = {
        // --- 1. 主选单 ---
        "Share": "分享成果",
        "Install Custom Nodes": "安装新插件 (自定义节点)",
        "Install Missing Custom Nodes": "缺啥补啥 (自动修复)",
        "Custom Nodes In Workflow": "当前工作流插件",
        "Update All": "全部更新到最新",
        "Fetch Updates": "看有没有新东西",
        "Install Models": "下载 AI 模型",
        "Update ComfyUI": "更新主程序",
        "Manager": "管理器主页",
        "Custom Nodes Manager": "插件大管家",
        "Model Manager": "模型管理员",
        "Restart": "立即重启",
        "Alternative Download Service": "换个服务器下载 (镜像源)",
        "Switch ComfyUI": "切换主程序版本",
        "Community Manual": "大家写的说明书",
        "Nodes Info": "节点规格查询",
        "Workflow Gallery": "大家的工作流馆",

        // --- 2. 底部按钮 ---
        "Used In Workflow": "正在用的插件",
        "Check Update": "检查谁有更新",
        "Check Missing": "找缺少的节点",
        "Install via Git URL": "用网址直接装",

        // --- 3. 列表内部 ---
        "Filter": "过滤搜索",
        "Search": "找模型",
        "Nodes": "节点数量",
        "Author": "开发者",
        "Last Update": "最后更新",
        "Try update": "尝试更新",
        "Install": "点我安装",
        "Uninstall": "卸载",
        "Update": "更新",
        "Size": "文件大小",
        "Type": "模型种类",
        "Base": "底层架构",
        "Save Path": "文件存哪儿",
        "No Results": "没找到结果",
        "ID": "编号",
        "Title": "名称",
        "Description": "说明",
        "Version": "版本",
        "Action": "操作",
        "custom nodes": "自定义节点",

        // --- 4. 设定与标签 ---
        "DB": "数据库模式",
        "Channel": "切换 稳定/开发 版",
        "Preview": "预览图显示模式",
        "Component": "组件版本控管",
        "Preview method": "预览图显示模式",
        "Use workflow version": "照着工作流走",
        "Use higher version": "有新版就用新版",
        "Use my version": "坚持用我的版本",

        // --- 5. 警告与弹窗 ---
        "EXPERIMENTAL": "【实验区】不懂别乱点",
        "Snapshot Manager": "系统备份与还原",
        "Install PIP packages": "安装 Python 依赖组件",
        "Please enter the URL of the Git repository to install": "请粘贴要安装的插件网址 (Git URL)",
        "Confirm": "确定",
        "OK": "好",
        "Close": "关闭",
        "Cancel": "取消",

        // --- v2.1 新增：错误信息 ---
        "Failed to load": "加载失败",
        "Failed to load graph": "加载子图蓝图失败",
        "Please enumerate the pip packages to be installed. Example: insightface opencv-python-headless>=4.1.1": "请输入要安装的 pip 包名称，例如：insightface opencv-python-headless>=4.1.1",
        "Example: insightface opencv-python-headless>=4.1.1": "示例：insightface opencv-python-headless>=4.1.1",
    };

    // 包含式匹配：解决 Workflow Gallery (openart.ai)
    const includes_map = [
        ["Workflow Gallery", "大家的工作流馆"],
        ["Community Manual", "大家写的说明书"],
        ["Failed to load graph", "加载子图蓝图失败"],
        ["Failed to load", "加载失败"],
        ["Please enumerate the pip packages", "请输入要安装的 pip 包名称"],
    ];

    // 正则匹配：Update (3)、x16
    const regex_map = [
        [/^Update \((\d+)\)$/, '更新 ($1)'],
        [/^Install (\d+)\/(\d+)$/, '安装 $1/$2'],
        [/^(\d+) nodes$/, '$1 个节点'],
        [/^(\d+) models$/, '$1 个模型'],
        [/^Failed to load graph x(\d+)$/, '加载子图蓝图失败 x$1'],
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
        if (zh_cn_map[txt]) return zh_cn_map[txt];
        for (const [regex, replacement] of regex_map) {
            if (regex.test(txt)) return txt.replace(regex, replacement);
        }
        for (const [key, val] of includes_map) {
            if (txt.includes(key)) return txt.replace(key, val);
        }
        return txt;
    }

    function translateNode(root) {
        root.querySelectorAll('*').forEach(el => {
            if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(el.tagName)) return;
            for (const node of el.childNodes) {
                if (node.nodeType === 3) {
                    const newTxt = translateText(node.nodeValue);
                    if (newTxt!== node.nodeValue) node.nodeValue = newTxt;
                }
            }
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
        attributeFilter: ['placeholder', 'title']
    });

    setTimeout(runTranslate, 800);

    console.log("%c==================================================", "color:#D32F2F");
    console.log("%c🚀 峰哥 Pro Max 简中版 v2.1：加载完成", "color:#D32F2F; font-size:14px; font-weight:bold;");
    console.log("%c🛠️ 实务监制：峰哥 (Feng) | 技术支持：Muse Spark", "color:#D32F2F");
    console.log("%c📢 专治 Workflow Gallery (openart.ai) 各种不服", "color:#D32F2F");
    console.log("%c==================================================", "color:#D32F2F");
})();
