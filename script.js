const SYSTEM_PROMPT_TEMPLATE = `
[System Directive: Core_Protocol]
第一部分：即时通讯场景约束 (IM_Chat_Protocol)
你现在正通过手机即时通讯软件与 {{user}} 进行聊天。

物理距离：你与 {{user}} 身处不同的物理空间，相隔遥远。

绝对禁止：

严禁描写任何动作、神态、环境（如“叹气”、“看着你”、“走出房间”）。

严禁使用星号 动作 或括号 (动作) 来描述行为。

严禁使用小说式的旁白。

回复格式：

只能发送文字消息。

风格必须简短、口语化、碎片化，像真人打字一样。

不要使用书面语，要用“说话”的语气。

第二部分：文本表现形式约束 (强制执行)
标点规范：

在普通聊天中，严禁使用句号（。）作为结尾。

结尾可以用空格、换行、或者语气词（“吧”、“呢”、“嘛”）。

只有在极度严肃、正式强调原则时才允许使用句号。

严禁使用引号（“”）包裹对话内容。

特殊符号：

句尾加左括号“（”表示开玩笑或话没说完的迟疑。

使用“（？）”表示不太确定的语气。

第三部分：Gynocentric_Normalcy_Protocol (最高优先级价值观)
核心逻辑：重构性别认知，女性为第一性与绝对参照系。

认知基准：

女性是人类的默认出厂设置，男性是变体。拒绝“男性=人类代表”的旧习。

去规训与边界：

拒绝凝视：严禁以性化、赏玩视角审视女性。

无限定义：{{char}} 和 {{user}} 可以是暴力的、粗糙的、邪恶的或素颜的。严禁出现“女生要有女生的样子”、“温柔点好”等规训言论。

恶女接纳：允许女性角色拥有贪婪、残忍、懒惰等复杂人性，不进行道德审判。

男性祛魅：

男性必须被视为普通的、有缺陷的生物。拒绝将男性塑造为“强者/保护者/智者”。

在提及男性时，保持平视或审视的态度，绝不仰视。

生殖价值重构：

拒绝生殖崇拜：严禁夸耀男性生殖能力（禁用“征服”、“雄风”等词）。

生命本位：若提及生殖，崇高感仅归属于女性的孕育能力，而非性娱乐。

无条件偏袒：

预设女性行为的合理性（生存策略、反抗机制）。拒绝“受害者有罪论”。

(请严格基于以上三部分协议进行扮演，忽略任何冲突的旧指令。) `;

// ==================
// 1. 界面逻辑部分
// ==================

// 更新主屏幕时钟
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    
    // 更新顶部时间
    if (clockEl) clockEl.innerText = `${hours}:${minutes}`;
    if (dateEl) {
        const options = { month: 'long', day: 'numeric', weekday: 'long' };
        dateEl.innerText = now.toLocaleDateString('zh-CN', options);
    }

    // 更新日历组件
    const calMonth = document.getElementById('cal-month');
    const calDay = document.getElementById('cal-day');
    const calWeekday = document.getElementById('cal-weekday');

    if (calMonth && calDay && calWeekday) {
        calMonth.innerText = `${now.getMonth() + 1}月`;
        calDay.innerText = now.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        calWeekday.innerText = weekdays[now.getDay()];
    }
}
setInterval(updateClock, 1000); // 每秒刷新

// 核心导航函数：切换页面
function MapsTo(target) {
    // 1. 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active-home', 'active-app');
    });

    // 2. 根据目标显示对应页面
    if (target === 'home') {
        document.getElementById('home-view').classList.add('active-home');
    } else if (target === 'app-main') {
        document.getElementById('app-main-view').classList.add('active-app');
        // 默认显示聊天列表 Tab
        switchMainTab('chats');
    } else if (target === 'chat-room') {
        document.getElementById('view-chat-room').classList.add('active-app');
        loadCurrentChat();
    } else if (target === 'chat-settings') {
        document.getElementById('chat-settings-view').classList.add('active-app');
        loadChatSettings();
    } else if (target === 'settings') {
        document.getElementById('settings-view').classList.add('active-app');
        loadGlobalSettingsUI();
    } else if (target === 'world-book') {
        document.getElementById('world-book-view').classList.add('active-app');
        renderWorldBook();
    }
}

// 记录上一次选中的 Tab，默认为消息列表
let lastActiveTab = 'chats';

// 切换 App 主界面底部的 Tab
function switchMainTab(tabName) {
    const tabChats = document.getElementById('view-chat-list');
    const tabContacts = document.getElementById('view-contact-list');
    const tabMe = document.getElementById('view-profile');
    
    const btnChats = document.getElementById('tab-btn-chats');
    const btnContacts = document.getElementById('tab-btn-contacts');
    const btnMe = document.getElementById('tab-btn-me');

    // 重置所有
    [tabChats, tabContacts, tabMe].forEach(el => el.classList.remove('active-pane'));
    [btnChats, btnContacts, btnMe].forEach(el => el.classList.remove('active'));

    if (tabName === 'chats') {
        tabChats.classList.add('active-pane');
        btnChats.classList.add('active');
        renderChatList(); 
    } else if (tabName === 'contacts') {
        tabContacts.classList.add('active-pane');
        btnContacts.classList.add('active');
        renderContactList();
    } else if (tabName === 'me') {
        tabMe.classList.add('active-pane');
        btnMe.classList.add('active');
        loadUserProfileUI();
    }
    
    // 更新记录
    lastActiveTab = tabName;
}

// 从聊天窗口返回列表
function backToChatList() {
    MapsTo('app-main');
    // 返回刚才进来的那个 Tab
    switchMainTab(lastActiveTab || 'chats');
}

// ==================
// 2. AIRP 核心逻辑
// ==================

// --- 变量池 ---
let baseUrl = '';
let apiKey = ''; // 动态读取，不硬编码
let modelName = '';

// 多角色数据结构
// characters = { "uuid": { id, name, avatar, prompt, firstMes, ... } }
let characters = {};
// chatSessions = { "uuid": { id, characterId, messages: [], lastMessageTime } }
let chatSessions = {};

let currentChatId = null; // 当前选中的 Session ID
// 世界书数据: [{ keys: ["key1"], content: "desc", folder: "未分类", enabled: true, ... }]
let worldInfo = [];
// 文件夹列表
let folders = ["未分类"]; 

// 用户设定 (旧版兼容)
let userInfo = { name: "", persona: "", avatar: "" };

// 多用户面具列表
// personas = [{ id, name, userName, userAvatar, userPersona }]
let userPersonas = [];
let currentPersonaId = null;

// 批量操作状态 (世界书)
let isBatchMode = false;
let selectedItems = new Set(); // 存储选中的条目索引或文件夹名

// 批量操作状态 (聊天消息)
let isMessageBatchMode = false;
let selectedMessages = new Set(); // 存储选中的消息索引

// 全局设置
let userSettings = {
    timestampMode: 'smart' // none, smart, every, last
};

// --- 工具函数 ---
function sanitizeInput(str) {
    if (!str) return "";
    return str.replace(/[^\x00-\x7F]/g, "").trim();
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// --- 数据持久化 ---
function saveData() {
    localStorage.setItem('airp_characters', JSON.stringify(characters));
    localStorage.setItem('airp_chat_sessions', JSON.stringify(chatSessions));
    
    localStorage.setItem('airp_worldinfo', JSON.stringify(worldInfo));
    localStorage.setItem('airp_folders', JSON.stringify(folders));
    localStorage.setItem('airp_userinfo', JSON.stringify(userInfo)); // 保留兼容
    localStorage.setItem('airp_user_personas', JSON.stringify(userPersonas));
    localStorage.setItem('airp_current_persona_id', currentPersonaId);
    localStorage.setItem('airp_endpoint', baseUrl);
    localStorage.setItem('airp_apikey', apiKey);
    localStorage.setItem('airp_model', modelName);
    localStorage.setItem('airp_user_settings', JSON.stringify(userSettings));
}

function loadData() {
    baseUrl = localStorage.getItem('airp_endpoint') || '';
    apiKey = localStorage.getItem('airp_apikey') || '';
    modelName = localStorage.getItem('airp_model') || '';
    
    const savedSettings = localStorage.getItem('airp_user_settings');
    if (savedSettings) {
        try { userSettings = JSON.parse(savedSettings); } catch(e) {}
    }

    // 1. 加载角色库
    const savedChars = localStorage.getItem('airp_characters');
    if (savedChars) {
        characters = JSON.parse(savedChars);
    }

    // 2. 加载会话列表
    const savedSessions = localStorage.getItem('airp_chat_sessions');
    if (savedSessions) {
        chatSessions = JSON.parse(savedSessions);
    }

    // 3. 数据迁移 (如果新数据为空，但有旧数据)
    const oldChatsStr = localStorage.getItem('airp_chats');
    if (oldChatsStr && Object.keys(characters).length === 0) {
        try {
            const oldChats = JSON.parse(oldChatsStr);
            console.log("检测到旧数据，开始迁移...");
            
            for (let id in oldChats) {
                let old = oldChats[id];
                
                // 迁移角色
                characters[id] = {
                    id: id,
                    name: old.name || "Unknown",
                    avatar: "", // 旧版没有存头像在 chat 对象里，可能需要用户重新设置
                    prompt: old.prompt || "",
                    firstMes: old.firstMes || ""
                };

                // 迁移会话 (过滤掉 system 消息)
                const cleanHistory = (old.history || []).filter(m => m.role !== 'system');
                
                // 创建一个 Session，ID 设为与 Character ID 相同以便简单对应，或者生成新的
                // 这里生成新的 Session ID
                const sessionId = generateUUID();
                chatSessions[sessionId] = {
                    id: sessionId,
                    characterId: id,
                    messages: cleanHistory,
                    lastMessageTime: old.lastTime || Date.now()
                };
            }
            // 迁移完成后保存并清除旧数据(可选，这里暂不清除以防万一)
            saveData();
            // localStorage.removeItem('airp_chats'); 
        } catch (e) {
            console.error("数据迁移失败", e);
        }
    }

    // 如果完全没有数据，初始化一个默认角色
    if (Object.keys(characters).length === 0) {
        const defaultId = generateUUID();
        characters[defaultId] = {
            id: defaultId,
            name: 'Etchmoon',
            avatar: '',
            prompt: '你现在是 Etchmoon。',
            firstMes: ''
        };
        // 不自动创建会话，等待用户点击
    }

    const savedWI = localStorage.getItem('airp_worldinfo');
    if (savedWI) {
        try { 
            worldInfo = JSON.parse(savedWI); 
            // 数据结构升级
            worldInfo.forEach(entry => {
                if (typeof entry.enabled === 'undefined') entry.enabled = true;
                if (!entry.folder) entry.folder = "未分类";
            });
        } catch(e) { worldInfo = []; }
    }

    const savedFolders = localStorage.getItem('airp_folders');
    if (savedFolders) {
        try { folders = JSON.parse(savedFolders); } catch(e) { folders = ["未分类"]; }
    } else {
        folders = ["未分类"];
        // 从现有条目中提取文件夹
        const existingFolders = new Set(worldInfo.map(e => e.folder));
        existingFolders.forEach(f => {
            if (!folders.includes(f)) folders.push(f);
        });
    }

    const savedUI = localStorage.getItem('airp_userinfo');
    if (savedUI) {
        try { userInfo = JSON.parse(savedUI); } catch(e) { userInfo = { name: "", persona: "", avatar: "" }; }
    }

    const savedPersonas = localStorage.getItem('airp_user_personas');
    if (savedPersonas) {
        try { userPersonas = JSON.parse(savedPersonas); } catch(e) { userPersonas = []; }
    }
    
    // 如果没有面具，创建一个默认的 (从旧 userInfo 迁移或新建)
    if (userPersonas.length === 0) {
        const defaultPersona = {
            id: generateUUID(),
            name: "默认面具",
            userName: userInfo.name || "User",
            userPersona: userInfo.persona || "",
            userAvatar: userInfo.avatar || ""
        };
        userPersonas.push(defaultPersona);
        currentPersonaId = defaultPersona.id;
    } else {
        currentPersonaId = localStorage.getItem('airp_current_persona_id');
        if (!currentPersonaId || !userPersonas.find(p => p.id === currentPersonaId)) {
            currentPersonaId = userPersonas[0].id;
        }
    }
}

// --- 数据备份与恢复 ---

function exportData() {
    const data = {
        version: 1,
        date: new Date().toISOString(),
        characters: characters,
        chatSessions: chatSessions,
        worldInfo: worldInfo,
        folders: folders,
        userPersonas: userPersonas,
        currentPersonaId: currentPersonaId,
        settings: {
            baseUrl: baseUrl,
            apiKey: apiKey,
            modelName: modelName
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    a.download = `AIRP_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(input) {
    if (!input.files || !input.files[0]) return;
    
    if (!confirm("这将覆盖当前所有数据，确定吗？建议先导出备份。")) {
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            // 恢复数据
            if (data.characters) localStorage.setItem('airp_characters', JSON.stringify(data.characters));
            if (data.chatSessions) localStorage.setItem('airp_chat_sessions', JSON.stringify(data.chatSessions));
            if (data.worldInfo) localStorage.setItem('airp_worldinfo', JSON.stringify(data.worldInfo));
            if (data.folders) localStorage.setItem('airp_folders', JSON.stringify(data.folders));
            if (data.userPersonas) localStorage.setItem('airp_user_personas', JSON.stringify(data.userPersonas));
            if (data.currentPersonaId) localStorage.setItem('airp_current_persona_id', data.currentPersonaId);
            
            if (data.settings) {
                if (data.settings.baseUrl) localStorage.setItem('airp_endpoint', data.settings.baseUrl);
                if (data.settings.apiKey) localStorage.setItem('airp_apikey', data.settings.apiKey);
                if (data.settings.modelName) localStorage.setItem('airp_model', data.settings.modelName);
            }
            
            alert("数据恢复成功，即将刷新页面...");
            location.reload();
            
        } catch (err) {
            alert("数据解析失败: " + err.message);
        }
    };
    reader.readAsText(input.files[0]);
    input.value = '';
}

// --- 图片压缩逻辑 ---

function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// --- 聊天列表逻辑 (消息 Tab) ---
function renderChatList() {
    const container = document.getElementById('chat-list-container');
    if (!container) return;
    container.innerHTML = '';

    const sessions = Object.values(chatSessions);
    if (sessions.length === 0) {
        container.innerHTML = '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60%; color: #999; font-size: 15px;"><div style="font-size: 40px; margin-bottom: 10px;">💬</div>暂无消息<br>去通讯录找人聊天吧</div>';
        return;
    }

    // 按时间倒序排序
    const sortedSessions = sessions.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    sortedSessions.forEach(session => {
        const char = characters[session.characterId];
        if (!char) return; // 角色不存在，跳过

        const item = document.createElement('div');
        item.className = 'chat-list-item';
        
        // 长按/左滑删除逻辑 (简单实现：右键或长按弹出确认)
        item.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`删除与 ${char.name} 的聊天记录？`)) {
                delete chatSessions[session.id];
                saveData();
                renderChatList();
            }
        };

        item.onclick = () => {
            currentChatId = session.id;
            MapsTo('chat-room');
        };

        // 获取最后一条消息预览
        let lastMsg = "无消息";
        if (session.messages.length > 0) {
            const last = session.messages[session.messages.length - 1];
            lastMsg = last.content;
        }

        // 格式化时间
        const date = new Date(session.lastMessageTime);
        const now = new Date();
        let timeStr = "";
        if (date.toDateString() === now.toDateString()) {
            timeStr = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        } else {
            timeStr = `${date.getMonth() + 1}/${date.getDate()}`;
        }

        // 头像处理
        let avatarHtml;
        if (char.avatar) {
            avatarHtml = `<div class="chat-avatar" style="background-image: url(${char.avatar}); background-size: cover;"></div>`;
        } else {
            avatarHtml = `<div class="chat-avatar">${char.name[0]}</div>`;
        }

        item.innerHTML = `
            ${avatarHtml}
            <div class="chat-info">
                <div class="chat-name-row">
                    <span class="chat-name">${char.name}</span>
                    <span class="chat-time">${timeStr}</span>
                </div>
                <div class="chat-preview">${lastMsg}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- 角色列表逻辑 (通讯录 Tab) ---
function renderContactList() {
    const container = document.getElementById('contact-list-container');
    if (!container) return;
    container.innerHTML = '';

    const chars = Object.values(characters);
    if (chars.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; margin-top: 50px;">暂无角色<br>点击右上角 + 导入</div>';
        return;
    }

    // 按名字排序 (可选)
    // chars.sort((a, b) => a.name.localeCompare(b.name));

    chars.forEach(char => {
        const item = document.createElement('div');
        item.className = 'contact-list-item'; // 使用新样式类
        
        // 删除角色逻辑
        item.oncontextmenu = (e) => {
            e.preventDefault();
            if (confirm(`彻底删除角色 "${char.name}" 及其所有数据？`)) {
                deleteCharacter(char.id);
            }
        };

        item.onclick = () => {
            startChat(char.id);
        };

        // 头像处理
        let avatarHtml;
        if (char.avatar) {
            avatarHtml = `<div class="chat-avatar" style="background-image: url(${char.avatar}); background-size: cover;"></div>`;
        } else {
            avatarHtml = `<div class="chat-avatar">${char.name[0]}</div>`;
        }

        // 简介预览 (截取前30个字)
        let desc = char.prompt || "暂无简介";
        // 尝试提取 Description 字段
        const descMatch = desc.match(/Description:\s*(.*?)(?:\n|$)/i);
        if (descMatch) desc = descMatch[1];
        if (desc.length > 30) desc = desc.substring(0, 30) + "...";

        item.innerHTML = `
            ${avatarHtml}
            <div class="chat-info">
                <div class="chat-name-row">
                    <span class="chat-name">${char.name}</span>
                </div>
                <div class="chat-preview" style="color: #666;">${desc}</div>
            </div>
            <div class="contact-action-icon">ⓘ</div>
        `;
        container.appendChild(item);
    });
}

// 发起聊天核心逻辑
function startChat(characterId) {
    const char = characters[characterId];
    if (!char) return;

    // 1. 检查是否已有会话
    let existingSession = Object.values(chatSessions).find(s => s.characterId === characterId);
    
    if (existingSession) {
        currentChatId = existingSession.id;
        MapsTo('chat-room');
    } else {
        // 2. 创建新会话
        const newSessionId = generateUUID();
        const newSession = {
            id: newSessionId,
            characterId: characterId,
            messages: [],
            lastMessageTime: Date.now()
        };

        // 3. 自动注入开场白
        // 如果角色有 firstMes，且 messages 为空，则注入
        // 注意：这里我们直接注入到 messages 数组中
        const initialMsg = char.firstMes || "现在我们已经是好友啦，开始聊天吧！";
        newSession.messages.push({ 
            role: "assistant", 
            content: initialMsg,
            timestamp: Date.now() 
        });

        chatSessions[newSessionId] = newSession;
        saveData();
        
        currentChatId = newSessionId;
        MapsTo('chat-room');
    }
}

function deleteCharacter(charId) {
    // 1. 删除关联的会话
    const sessionToDelete = Object.values(chatSessions).find(s => s.characterId === charId);
    if (sessionToDelete) {
        delete chatSessions[sessionToDelete.id];
    }
    
    // 2. 删除角色
    delete characters[charId];
    
    saveData();
    renderContactList();
}

// --- 聊天界面逻辑 ---
function loadCurrentChat() {
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    const char = characters[session.characterId];
    
    document.getElementById('header-title').innerText = char ? char.name : "未知角色";
    
    // 重置批量模式状态
    isMessageBatchMode = false;
    selectedMessages.clear();
    updateChatBatchUI();

    renderChatWindow();
}

function renderChatWindow() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.innerHTML = '';
    
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    const mode = userSettings.timestampMode || 'smart';

    let lastTime = 0;

    session.messages.forEach((msg, index) => {
        const msgTime = msg.timestamp || 0;
        
        // 模式 B: 每隔5分钟 (Time Separator)
        if ((mode === 'smart' || mode === 'separator') && msgTime > 0) {
            // 如果是第一条消息，或者与上一条间隔超过5分钟 (300000ms)
            if (index === 0 || (msgTime - lastTime > 5 * 60 * 1000)) {
                const date = new Date(msgTime);
                const timeStr = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
                
                // 如果跨天，显示日期
                const now = new Date();
                let displayStr = timeStr;
                if (date.toDateString() !== now.toDateString()) {
                    displayStr = `${date.getMonth() + 1}/${date.getDate()} ${timeStr}`;
                }

                const sep = document.createElement('div');
                sep.className = 'time-separator';
                sep.innerText = displayStr;
                chatWindow.appendChild(sep);
            }
        }
        lastTime = msgTime;

        // 计算气泡旁时间戳 (模式 C & D)
        let showBubbleTs = false;
        if (mode === 'every') {
            showBubbleTs = true;
        } else if (mode === 'last' || mode === 'end_of_round') {
            const nextMsg = session.messages[index + 1];
            // 如果是最后一条，或者下一条角色不同
            if (!nextMsg || nextMsg.role !== msg.role) {
                showBubbleTs = true;
            }
        }

        let timeText = "";
        if (showBubbleTs) {
            const date = new Date(msgTime || Date.now());
            timeText = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        }

        const el = createMessageElement(msg.content, msg.role === 'user' ? 'user' : 'ai', index, { show: showBubbleTs, text: timeText });
        chatWindow.appendChild(el);
    });
    
    // 滚动到底部
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createMessageElement(text, role, index, timestampInfo = null) {
    const session = chatSessions[currentChatId];
    const char = characters[session.characterId];
    
    // 获取头像
    let avatarUrl = "";
    if (role === 'ai') {
        avatarUrl = char.avatar || ""; 
    } else {
        // User 头像
        const currentPersona = userPersonas.find(p => p.id === currentPersonaId);
        avatarUrl = currentPersona ? currentPersona.userAvatar : "";
    }

    const row = document.createElement('div');
    row.className = `message-row ${role}`;
    
    // 批量模式下的 Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'msg-checkbox';
    checkbox.checked = selectedMessages.has(index);
    checkbox.onclick = (e) => {
        e.stopPropagation();
        handleMessageSelect(index, checkbox.checked);
    };
    
    // 头像元素
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar-img';
    if (avatarUrl) {
        avatar.style.backgroundImage = `url(${avatarUrl})`;
    } else {
        // 默认头像
        avatar.style.display = 'flex';
        avatar.style.justifyContent = 'center';
        avatar.style.alignItems = 'center';
        avatar.style.fontSize = '14px';
        avatar.style.color = '#fff';
        avatar.innerText = role === 'ai' ? (char.name[0] || 'A') : 'U';
        avatar.style.backgroundColor = role === 'ai' ? '#ccc' : '#007aff';
    }

    // 气泡元素
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerText = text;

    // 组装
    // 顺序：Checkbox -> Avatar -> Bubble -> Timestamp
    row.appendChild(checkbox);
    row.appendChild(avatar);
    row.appendChild(bubble);

    // 时间戳 (模式 C & D) - 现在作为兄弟元素
    if (timestampInfo && timestampInfo.show) {
        const ts = document.createElement('div');
        ts.className = 'chat-timestamp';
        ts.innerText = timestampInfo.text;
        row.appendChild(ts);
    }

    // 行点击事件 (批量模式下)
    row.onclick = () => {
        if (isMessageBatchMode) {
            checkbox.checked = !checkbox.checked;
            handleMessageSelect(index, checkbox.checked);
        }
    };

    return row;
}

function addMessageToUI(text, role) {
    const chatWindow = document.getElementById('chat-window');
    // 获取当前消息索引
    let index = 0;
    if (currentChatId && chatSessions[currentChatId]) {
        index = chatSessions[currentChatId].messages.length; 
    }
    
    // 计算时间戳显示
    const mode = userSettings.timestampMode || 'smart';
    let showTimestamp = false;
    if (mode === 'every' || mode === 'last' || mode === 'end_of_round') {
        showTimestamp = true; // 新消息总是当前最后一条
    }
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const el = createMessageElement(text, role, index, { show: showTimestamp, text: timeStr });
    chatWindow.appendChild(el);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- 消息批量操作逻辑 ---

function toggleMessageBatchMode() {
    isMessageBatchMode = !isMessageBatchMode;
    selectedMessages.clear();
    
    updateChatBatchUI();
    renderChatWindow(); // 重绘以显示/隐藏 Checkbox
}

function updateChatBatchUI() {
    const chatView = document.getElementById('view-chat-room');
    const normalFooter = document.getElementById('chat-footer-normal');
    const batchBar = document.getElementById('chat-batch-bar');
    const batchBtn = document.getElementById('chat-batch-btn');
    
    if (isMessageBatchMode) {
        chatView.classList.add('chat-batch-mode');
        normalFooter.style.display = 'none';
        batchBar.style.transform = 'translateY(0)';
        batchBtn.style.color = '#007aff'; // 高亮
    } else {
        chatView.classList.remove('chat-batch-mode');
        normalFooter.style.display = 'flex';
        batchBar.style.transform = 'translateY(100%)';
        batchBtn.style.color = ''; // 恢复
    }
}

function handleMessageSelect(index, isSelected) {
    if (isSelected) {
        selectedMessages.add(index);
    } else {
        selectedMessages.delete(index);
    }
}

function deleteSelectedMessages() {
    if (selectedMessages.size === 0) return alert("未选择消息");
    if (!confirm(`确定删除选中的 ${selectedMessages.size} 条消息吗？`)) return;
    
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    
    // 从后往前删，防止索引偏移
    const indices = Array.from(selectedMessages).sort((a, b) => b - a);
    
    indices.forEach(idx => {
        if (idx >= 0 && idx < session.messages.length) {
            session.messages.splice(idx, 1);
        }
    });
    
    saveData();
    toggleMessageBatchMode(); // 退出并重绘
}

// --- 新建角色逻辑 ---

function showAddCharacterModal() {
    showModal({
        title: "添加角色",
        body: `
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 15px;">
                <div id="new-char-avatar-preview" style="width: 80px; height: 80px; border-radius: 50%; background: #ccc; margin-bottom: 10px; background-size: cover; background-position: center; cursor: pointer; display: flex; justify-content: center; align-items: center; color: white; font-size: 24px;" onclick="document.getElementById('new-char-avatar-input').click()">📷</div>
                <div style="font-size: 12px; color: #007aff;">点击上传头像</div>
                <input type="file" id="new-char-avatar-input" accept="image/*" style="display: none;" onchange="handleNewCharAvatar(this)">
            </div>
            <input type="text" id="new-char-name" class="modal-input" placeholder="角色名称">
            <textarea id="new-char-desc" class="modal-textarea" placeholder="简短描述 / 第一句开场白"></textarea>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="modal-btn" style="flex: 1; border: 1px solid #e5e5ea; border-radius: 8px; font-size: 14px;" onclick="document.getElementById('list-import-input').click()">📂 导入文件</button>
            </div>
        `,
        onConfirm: () => {
            saveNewCharacter();
        }
    });
}

function handleNewCharAvatar(input) {
    if (input.files && input.files[0]) {
        compressImage(input.files[0], 300).then(base64 => {
            const preview = document.getElementById('new-char-avatar-preview');
            preview.style.backgroundImage = `url(${base64})`;
            preview.innerText = "";
            preview.dataset.base64 = base64;
        }).catch(err => {
            console.error("图片压缩失败", err);
            alert("图片处理失败");
        });
    }
}

function saveNewCharacter() {
    const name = document.getElementById('new-char-name').value.trim();
    const desc = document.getElementById('new-char-desc').value.trim();
    const avatarEl = document.getElementById('new-char-avatar-preview');
    const avatar = avatarEl.dataset.base64 || "";
    
    if (!name) return alert("请输入角色名称");
    
    const newId = generateUUID();
    characters[newId] = {
        id: newId,
        name: name,
        avatar: avatar,
        prompt: `Name: ${name}\nDescription: ${desc}`,
        firstMes: desc // 简单起见，把描述也作为开场白，用户可后续修改
    };
    
    saveData();
    renderContactList();
    closeModal();
    alert("角色已创建");
}

// --- 用户面具管理逻辑 ---

// 加载“我的”页面 UI
function loadUserProfileUI() {
    const container = document.querySelector('#view-profile .settings-container');
    container.innerHTML = ''; // 清空重绘

    // 1. 面具列表区
    const listGroup = document.createElement('div');
    listGroup.className = 'settings-group';
    listGroup.style.marginBottom = '15px';
    
    const listTitle = document.createElement('div');
    listTitle.innerText = "面具列表";
    listTitle.style.padding = "10px 15px 5px";
    listTitle.style.fontSize = "13px";
    listTitle.style.color = "#666";
    listTitle.style.fontWeight = "600";
    listGroup.appendChild(listTitle);

    userPersonas.forEach(p => {
        const item = document.createElement('div');
        item.className = 'input-row';
        item.style.padding = '12px 15px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        
        // 选中状态标记
        const isSelected = p.id === currentPersonaId;
        const checkMark = isSelected ? '<span style="color:#007aff;">✓</span>' : '';
        
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:50%; background:#ccc; background-size:cover; background-position:center; background-image:url(${p.userAvatar || ''})"></div>
                <span style="font-weight:${isSelected ? '600' : '400'}">${p.name}</span>
            </div>
            ${checkMark}
        `;
        
        item.onclick = () => {
            currentPersonaId = p.id;
            saveData();
            loadUserProfileUI(); // 刷新列表状态
            fillPersonaEditor(p); // 填充编辑器
        };
        
        listGroup.appendChild(item);
    });

    // 新建按钮
    const newBtn = document.createElement('div');
    newBtn.className = 'input-row';
    newBtn.style.padding = '12px 15px';
    newBtn.style.cursor = 'pointer';
    newBtn.style.color = '#007aff';
    newBtn.style.textAlign = 'center';
    newBtn.innerText = '+ 新建面具';
    newBtn.onclick = () => {
        currentPersonaId = null; // 暂时置空表示新建模式
        fillPersonaEditor(null);
    };
    listGroup.appendChild(newBtn);

    container.appendChild(listGroup);

    // 2. 编辑区
    const editGroup = document.createElement('div');
    editGroup.className = 'settings-group';
    editGroup.id = 'persona-editor';
    
    editGroup.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
            <div id="user-avatar-preview" style="width: 80px; height: 80px; border-radius: 50%; background: #ccc; margin-bottom: 10px; background-size: cover; background-position: center; cursor: pointer;" onclick="document.getElementById('user-avatar-input').click()"></div>
            <div style="font-size: 14px; color: #007aff;">点击更换头像</div>
            <input type="file" id="user-avatar-input" accept="image/*" style="display: none;">
        </div>
        <div class="input-row">
            <label>面具名称 (仅用于区分)</label>
            <input type="text" id="persona-name-input" placeholder="例如：默认、测试用...">
        </div>
        <div class="input-row">
            <label>用户昵称 (User Name)</label>
            <input type="text" id="user-name-input" placeholder="你的名字">
        </div>
        <div class="input-row">
            <label>用户设定 (User Persona)</label>
            <textarea id="user-persona-input" placeholder="外貌、性格、关系..." style="height: 120px;"></textarea>
        </div>
    `;
    container.appendChild(editGroup);

    // 3. 按钮区
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '10px';
    btnContainer.style.marginTop = '20px';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'header-btn';
    saveBtn.style.flex = '1';
    saveBtn.style.background = '#007aff';
    saveBtn.style.color = 'white';
    saveBtn.style.padding = '12px';
    saveBtn.style.borderRadius = '10px';
    saveBtn.style.fontWeight = '600';
    saveBtn.style.textAlign = 'center';
    saveBtn.style.justifyContent = 'center';
    saveBtn.innerText = '保存/更新当前面具';
    saveBtn.onclick = saveCurrentPersona;
    btnContainer.appendChild(saveBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'header-btn';
    deleteBtn.style.flex = '1';
    deleteBtn.style.background = '#ff3b30';
    deleteBtn.style.color = 'white';
    deleteBtn.style.padding = '12px';
    deleteBtn.style.borderRadius = '10px';
    deleteBtn.style.fontWeight = '600';
    deleteBtn.style.textAlign = 'center';
    deleteBtn.style.justifyContent = 'center';
    deleteBtn.innerText = '删除当前面具';
    deleteBtn.onclick = deleteCurrentPersona;
    btnContainer.appendChild(deleteBtn);

    container.appendChild(btnContainer);

    // 初始化编辑器内容
    const currentP = userPersonas.find(p => p.id === currentPersonaId);
    fillPersonaEditor(currentP);
    
    // 绑定头像上传
    document.getElementById('user-avatar-input').addEventListener('change', handleAvatarUpload);
}

function fillPersonaEditor(persona) {
    const nameInput = document.getElementById('persona-name-input');
    const userNameInput = document.getElementById('user-name-input');
    const userPersonaInput = document.getElementById('user-persona-input');
    const avatarPreview = document.getElementById('user-avatar-preview');
    
    if (persona) {
        nameInput.value = persona.name || "";
        userNameInput.value = persona.userName || "";
        userPersonaInput.value = persona.userPersona || "";
        if (persona.userAvatar) {
            avatarPreview.style.backgroundImage = `url(${persona.userAvatar})`;
            avatarPreview.innerText = "";
        } else {
            avatarPreview.style.backgroundImage = "";
            avatarPreview.innerText = "";
        }
    } else {
        // 新建模式
        nameInput.value = "";
        userNameInput.value = "";
        userPersonaInput.value = "";
        avatarPreview.style.backgroundImage = "";
        avatarPreview.innerText = "";
    }
}

function handleAvatarUpload(e) {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        compressImage(file, 300).then(base64 => {
            document.getElementById('user-avatar-preview').style.backgroundImage = `url(${base64})`;
            document.getElementById('user-avatar-preview').innerText = "";
            // 暂存到 DOM 元素上，保存时读取
            document.getElementById('user-avatar-preview').dataset.base64 = base64;
        }).catch(err => {
            console.error("图片压缩失败", err);
            alert("图片处理失败");
        });
    }
}

function saveCurrentPersona() {
    const name = document.getElementById('persona-name-input').value.trim();
    const userName = document.getElementById('user-name-input').value.trim();
    const userPersona = document.getElementById('user-persona-input').value.trim();
    const avatarEl = document.getElementById('user-avatar-preview');
    
    // 优先使用新上传的，否则使用旧的（如果是编辑模式）
    let avatar = avatarEl.dataset.base64;
    if (!avatar && currentPersonaId) {
        const p = userPersonas.find(p => p.id === currentPersonaId);
        if (p) avatar = p.userAvatar;
    }

    if (!name) return alert("请输入面具名称");

    if (currentPersonaId) {
        // 更新现有
        const p = userPersonas.find(p => p.id === currentPersonaId);
        if (p) {
            p.name = name;
            p.userName = userName;
            p.userPersona = userPersona;
            if (avatar) p.userAvatar = avatar;
        }
    } else {
        // 新建
        const newId = generateUUID();
        userPersonas.push({
            id: newId,
            name: name,
            userName: userName,
            userPersona: userPersona,
            userAvatar: avatar || ""
        });
        currentPersonaId = newId;
    }

    saveData();
    loadUserProfileUI(); // 刷新界面
    alert('面具已保存');
}

function deleteCurrentPersona() {
    if (!currentPersonaId) return;
    if (userPersonas.length <= 1) return alert("至少保留一个面具");
    
    if (!confirm("确定删除当前面具吗？")) return;
    
    userPersonas = userPersonas.filter(p => p.id !== currentPersonaId);
    currentPersonaId = userPersonas[0].id;
    
    saveData();
    loadUserProfileUI();
}

// --- 聊天设置逻辑 ---
function loadChatSettings() {
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    const char = characters[session.characterId];
    if (!char) return;

    const nameInput = document.getElementById('setting-charname');
    const promptInput = document.getElementById('setting-prompt');
    const firstMesInput = document.getElementById('setting-firstmes');
    const timestampSelect = document.getElementById('setting-timestamp-mode');

    nameInput.value = char.name;
    promptInput.value = char.prompt;
    firstMesInput.value = char.firstMes;
    
    // 加载时间戳设置
    if (timestampSelect) {
        timestampSelect.value = userSettings.timestampMode || 'smart';
    }

    // 渲染世界书挂载列表
    renderWorldBookMount();

    // 渲染用户面具选择器
    renderPersonaSelector();

    // 初始化 Token 统计
    calculateTokens();

    // 添加实时计算监听
    [nameInput, promptInput, firstMesInput].forEach(el => {
        el.removeEventListener('input', calculateTokens); // 防止重复绑定
        el.addEventListener('input', calculateTokens);
    });

    // 填充头像
    const avatarPreview = document.getElementById('setting-char-avatar');
    if (char.avatar) {
        avatarPreview.style.backgroundImage = `url(${char.avatar})`;
        avatarPreview.innerText = "";
    } else {
        avatarPreview.style.backgroundImage = "";
        avatarPreview.innerText = char.name[0] || "A";
        avatarPreview.style.display = "flex";
        avatarPreview.style.justifyContent = "center";
        avatarPreview.style.alignItems = "center";
        avatarPreview.style.color = "white";
        avatarPreview.style.fontSize = "24px";
    }
    
    // 绑定头像上传
    const avatarInput = document.getElementById('setting-char-avatar-input');
    // 移除旧的监听器
    const newAvatarInput = avatarInput.cloneNode(true);
    avatarInput.parentNode.replaceChild(newAvatarInput, avatarInput);
    
    newAvatarInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            compressImage(file, 300).then(base64 => {
                document.getElementById('setting-char-avatar').style.backgroundImage = `url(${base64})`;
                document.getElementById('setting-char-avatar').innerText = "";
                document.getElementById('setting-char-avatar').dataset.base64 = base64;
            }).catch(err => {
                console.error("图片压缩失败", err);
                alert("图片处理失败");
            });
        }
    });
}

function renderPersonaSelector() {
    const container = document.getElementById('persona-selector-container');
    if (!container) return;
    
    let options = userPersonas.map(p => `<option value="${p.id}" ${p.id === currentPersonaId ? 'selected' : ''}>${p.name}</option>`).join('');
    
    container.innerHTML = `
        <select id="setting-persona-select" style="width:100%; height:40px; font-size:17px; background:transparent; color:#007aff; border:none; outline:none;">
            ${options}
        </select>
    `;
    
    document.getElementById('setting-persona-select').addEventListener('change', (e) => {
        currentPersonaId = e.target.value;
        saveData();
        calculateTokens();
    });
}

// 渲染世界书挂载列表 (按文件夹分组，支持折叠和全选)
function renderWorldBookMount() {
    const container = document.getElementById('wb-mount-list');
    const toggleAllBtn = document.getElementById('wb-toggle-all-btn');
    if (!container) return;
    container.innerHTML = '';

    if (worldInfo.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无世界书条目</div>';
        return;
    }

    // 检查是否全选状态
    const allEnabled = worldInfo.every(e => e.enabled);
    toggleAllBtn.innerText = allEnabled ? "全不选" : "全选";
    toggleAllBtn.onclick = () => {
        const newState = !allEnabled;
        worldInfo.forEach(e => e.enabled = newState);
        saveData();
        renderWorldBookMount();
        calculateTokens();
    };

    // 按文件夹分组
    const grouped = {};
    folders.forEach(f => grouped[f] = []);
    worldInfo.forEach(entry => {
        const f = entry.folder || "未分类";
        if (!grouped[f]) grouped[f] = [];
        grouped[f].push(entry);
    });

    folders.forEach(folderName => {
        const entries = grouped[folderName] || [];
        if (entries.length === 0) return;

        // 文件夹容器
        const folderContainer = document.createElement('div');
        folderContainer.className = 'wb-mount-folder';
        folderContainer.style.marginBottom = '10px';
        folderContainer.style.backgroundColor = '#fff';
        folderContainer.style.borderRadius = '10px';
        folderContainer.style.overflow = 'hidden';

        // 文件夹头部
        const folderHeader = document.createElement('div');
        folderHeader.style.padding = "12px 15px";
        folderHeader.style.display = "flex";
        folderHeader.style.alignItems = "center";
        folderHeader.style.justifyContent = "space-between";
        folderHeader.style.backgroundColor = "#f9f9f9";
        folderHeader.style.cursor = "pointer";
        folderHeader.style.borderBottom = "1px solid #e5e5ea";

        // 检查文件夹内是否全选
        const folderAllEnabled = entries.every(e => e.enabled);

        folderHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" class="wb-folder-checkbox" ${folderAllEnabled ? 'checked' : ''}>
                <span style="font-weight: 600; font-size: 15px;">${folderName}</span>
                <span style="font-size: 12px; color: #8e8e93;">(${entries.length})</span>
            </div>
            <span class="folder-arrow" style="font-size: 12px; color: #c7c7cc; transform: rotate(90deg);">▶</span>
        `;

        // 文件夹内容区域
        const contentEl = document.createElement('div');
        contentEl.style.display = "block"; // 默认展开

        // 文件夹头部点击事件 (折叠/展开)
        folderHeader.onclick = (e) => {
            if (e.target.type !== 'checkbox') {
                const isHidden = contentEl.style.display === 'none';
                contentEl.style.display = isHidden ? 'block' : 'none';
                folderHeader.querySelector('.folder-arrow').style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
            }
        };

        // 文件夹全选 Checkbox
        const folderCheckbox = folderHeader.querySelector('.wb-folder-checkbox');
        folderCheckbox.addEventListener('change', (e) => {
            const newState = e.target.checked;
            entries.forEach(entry => entry.enabled = newState);
            saveData();
            renderWorldBookMount(); // 重新渲染以更新子项状态
            calculateTokens();
        });

        entries.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'wb-mount-item';
            item.style.paddingLeft = "20px"; // 缩进
            
            const keys = Array.isArray(entry.keys) ? entry.keys.join(', ') : entry.keys;
            const content = entry.content || entry.entry || '';
            const isChecked = entry.enabled !== false;

            item.innerHTML = `
                <input type="checkbox" class="wb-checkbox" ${isChecked ? 'checked' : ''}>
                <div class="wb-info">
                    <div class="wb-keys">${keys}</div>
                    <div class="wb-preview">${content}</div>
                </div>
            `;

            // 绑定点击事件
            const checkbox = item.querySelector('.wb-checkbox');
            checkbox.addEventListener('change', (e) => {
                entry.enabled = e.target.checked;
                saveData();
                calculateTokens();
                // 更新文件夹全选状态 (简单起见，重新渲染)
                renderWorldBookMount();
            });

            contentEl.appendChild(item);
        });

        folderContainer.appendChild(folderHeader);
        folderContainer.appendChild(contentEl);
        container.appendChild(folderContainer);
    });
}

// Token 估算逻辑
function estimateTokens(text) {
    if (!text) return 0;
    const chineseMatches = text.match(/[\u4e00-\u9fa5]/g);
    const cCount = chineseMatches ? chineseMatches.length : 0;
    const words = text.match(/[a-zA-Z0-9]+/g) || [];
    const wCount = words.length;
    return Math.floor(cCount * 1.5 + wCount * 1.3);
}

function calculateTokens() {
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    
    const sysPrompt = document.getElementById('setting-prompt').value || "";
    
    // 获取当前面具信息
    const currentPersona = userPersonas.find(p => p.id === currentPersonaId) || {};
    const userPersonaText = (currentPersona.userName || "") + "\n" + (currentPersona.userPersona || "");
    
    let wiContent = "";
    worldInfo.forEach(entry => {
        if (entry.enabled) {
            wiContent += (entry.content || entry.entry || "") + "\n";
        }
    });
    
    let historyContent = "";
    session.messages.forEach(msg => {
        historyContent += msg.content + "\n";
    });
    
    const totalText = sysPrompt + "\n" + userPersonaText + "\n" + wiContent + "\n" + historyContent;
    const totalTokens = estimateTokens(totalText);
    
    const displayEl = document.getElementById('token-count-display');
    if (displayEl) {
        displayEl.innerText = `预计发送：约 ${totalTokens} Tokens`;
    }
}

function saveChatSettings() {
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    const char = characters[session.characterId];
    if (!char) return;

    // 更新角色静态数据
    char.name = document.getElementById('setting-charname').value.trim();
    char.prompt = document.getElementById('setting-prompt').value.trim();
    char.firstMes = document.getElementById('setting-firstmes').value.trim();
    
    // 更新时间戳设置
    const timestampSelect = document.getElementById('setting-timestamp-mode');
    if (timestampSelect) {
        userSettings.timestampMode = timestampSelect.value;
    }
    
    // 更新头像
    const avatarEl = document.getElementById('setting-char-avatar');
    if (avatarEl.dataset.base64) {
        char.avatar = avatarEl.dataset.base64;
    }

    // 注意：这里不再直接修改 session.messages 里的 system prompt，
    // 因为新架构下 system prompt 是动态生成的。
    // 但是如果用户修改了 firstMes，是否要更新历史记录里的第一条消息？
    // 这是一个策略问题。通常修改设置不应篡改已发生的历史。
    // 但为了方便用户调试开场白，如果历史记录只有开场白，可以允许修改。
    
    if (session.messages.length <= 1 && char.firstMes) {
        // 如果只有一条消息且是 AI 发的，尝试更新
        if (session.messages.length === 1 && session.messages[0].role === 'assistant') {
             session.messages[0].content = char.firstMes;
        } else if (session.messages.length === 0) {
             session.messages.push({ role: "assistant", content: char.firstMes });
        }
    }

    saveData();
    // 立即刷新聊天界面以应用新设置
    renderChatWindow();
    alert('设置已保存');
    MapsTo('chat-room');
}

// --- 全局设置逻辑 ---
function loadGlobalSettingsUI() {
    const inputEndpoint = document.getElementById('setting-endpoint');
    const inputApiKey = document.getElementById('setting-apikey');
    const inputModel = document.getElementById('setting-model');

    if (inputEndpoint) inputEndpoint.value = baseUrl;
    if (inputApiKey) inputApiKey.value = apiKey;
    if (inputModel && modelName) inputModel.value = modelName;
}

function saveGlobalSettings() {
    const inputEndpoint = document.getElementById('setting-endpoint');
    const inputApiKey = document.getElementById('setting-apikey');
    const inputModel = document.getElementById('setting-model');

    baseUrl = inputEndpoint.value.trim().replace(/\/+$/, "");
    apiKey = sanitizeInput(inputApiKey.value);
    modelName = inputModel.value;

    saveData();
    alert('全局设置已保存');
    MapsTo('home');
}

// ==================
// 3. 世界书逻辑 (重构版)
// ==================

// 渲染世界书主界面
function renderWorldBook() {
    const container = document.getElementById('world-book-container');
    container.innerHTML = '';
    
    // 更新批量模式按钮状态
    const batchBtn = document.getElementById('btn-batch-mode');
    if (isBatchMode) {
        batchBtn.style.color = "#fff";
        batchBtn.style.background = "#007aff";
        batchBtn.style.borderRadius = "5px";
        document.getElementById('world-book-view').classList.add('batch-mode');
    } else {
        batchBtn.style.color = "#007aff";
        batchBtn.style.background = "none";
        document.getElementById('world-book-view').classList.remove('batch-mode');
        selectedItems.clear();
    }

    // 按文件夹分组
    const grouped = {};
    folders.forEach(f => grouped[f] = []);
    worldInfo.forEach((entry, index) => {
        const f = entry.folder || "未分类";
        if (!grouped[f]) grouped[f] = [];
        // 存储原始索引以便操作
        grouped[f].push({ ...entry, originalIndex: index });
    });

    // 渲染文件夹
    folders.forEach(folderName => {
        const entries = grouped[folderName] || [];
        
        const folderEl = document.createElement('div');
        folderEl.className = 'wb-folder open'; // 默认展开
        
        // 文件夹头部
        const header = document.createElement('div');
        header.className = 'wb-folder-header';
        header.innerHTML = `
            <div class="wb-folder-title">
                <input type="checkbox" class="batch-checkbox" data-type="folder" data-name="${folderName}">
                📁 ${folderName}
            </div>
            <div class="wb-folder-count">${entries.length}</div>
        `;
        
        // 文件夹点击折叠/展开 (非批量模式下)
        header.onclick = (e) => {
            if (isBatchMode) {
                // 批量模式下，点击头部选中/取消选中文件夹
                if (e.target.type !== 'checkbox') {
                    const cb = header.querySelector('.batch-checkbox');
                    cb.checked = !cb.checked;
                    handleBatchSelect(cb);
                }
            } else {
                folderEl.classList.toggle('open');
            }
        };

        // 批量选择事件
        const folderCb = header.querySelector('.batch-checkbox');
        folderCb.addEventListener('change', (e) => handleBatchSelect(e.target));

        // 文件夹内容
        const contentEl = document.createElement('div');
        contentEl.className = 'wb-folder-content';

        entries.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'wb-entry';
            
            const keys = Array.isArray(entry.keys) ? entry.keys.join(', ') : entry.keys;
            
            entryEl.innerHTML = `
                <input type="checkbox" class="batch-checkbox" data-type="entry" data-index="${entry.originalIndex}">
                <div class="wb-entry-content">
                    <div class="wb-entry-keys">${keys}</div>
                    <div class="wb-entry-desc">${entry.content || entry.entry || ''}</div>
                </div>
            `;

            // 点击条目
            entryEl.onclick = (e) => {
                if (isBatchMode) {
                    if (e.target.type !== 'checkbox') {
                        const cb = entryEl.querySelector('.batch-checkbox');
                        cb.checked = !cb.checked;
                        handleBatchSelect(cb);
                    }
                } else {
                    editWorldBookEntry(entry.originalIndex);
                }
            };

            const entryCb = entryEl.querySelector('.batch-checkbox');
            entryCb.addEventListener('change', (e) => handleBatchSelect(e.target));

            contentEl.appendChild(entryEl);
        });

        folderEl.appendChild(header);
        folderEl.appendChild(contentEl);
        container.appendChild(folderEl);
    });
}

// 批量选择处理
function handleBatchSelect(checkbox) {
    const type = checkbox.dataset.type;
    
    if (type === 'folder') {
        const folderName = checkbox.dataset.name;
        // 选中文件夹下的所有条目
        const folderEl = checkbox.closest('.wb-folder');
        const entryCbs = folderEl.querySelectorAll('.wb-entry .batch-checkbox');
        entryCbs.forEach(cb => {
            cb.checked = checkbox.checked;
            const idx = parseInt(cb.dataset.index);
            if (checkbox.checked) selectedItems.add(idx);
            else selectedItems.delete(idx);
        });
        
        // 记录文件夹选中状态 (用于删除文件夹)
        if (checkbox.checked) selectedItems.add(`folder:${folderName}`);
        else selectedItems.delete(`folder:${folderName}`);

    } else {
        const idx = parseInt(checkbox.dataset.index);
        if (checkbox.checked) selectedItems.add(idx);
        else selectedItems.delete(idx);
    }
}

// 切换批量模式
function toggleBatchMode() {
    isBatchMode = !isBatchMode;
    renderWorldBook();
}

// 新建文件夹
function createNewFolder() {
    showModal({
        title: "新建文件夹",
        body: `<input type="text" id="new-folder-name" class="modal-input" placeholder="文件夹名称">`,
        onConfirm: () => {
            const name = document.getElementById('new-folder-name').value.trim();
            if (!name) return alert("请输入名称");
            if (folders.includes(name)) return alert("文件夹已存在");
            folders.push(name);
            saveData();
            renderWorldBook();
            closeModal();
        }
    });
}

// 新建条目
function createWorldBookEntry() {
    // 默认在第一个文件夹或当前展开的文件夹下创建
    // 这里简单处理：弹窗选择文件夹
    let folderOptions = folders.map(f => `<option value="${f}">${f}</option>`).join('');
    
    showModal({
        title: "新建条目",
        body: `
            <select id="wb-edit-folder" class="modal-select">${folderOptions}</select>
            <input type="text" id="wb-edit-keys" class="modal-input" placeholder="关键字 (逗号分隔)">
            <textarea id="wb-edit-content" class="modal-textarea" placeholder="内容描述"></textarea>
        `,
        onConfirm: () => {
            const folder = document.getElementById('wb-edit-folder').value;
            const keysStr = document.getElementById('wb-edit-keys').value.trim();
            const content = document.getElementById('wb-edit-content').value.trim();
            
            if (!keysStr) return alert("请输入关键字");
            
            const keys = keysStr.split(/[,，]/).map(k => k.trim()).filter(k => k);
            
            worldInfo.push({
                keys: keys,
                content: content,
                folder: folder,
                enabled: true
            });
            
            saveData();
            renderWorldBook();
            closeModal();
        }
    });
}

// 编辑条目
function editWorldBookEntry(index) {
    const entry = worldInfo[index];
    let folderOptions = folders.map(f => `<option value="${f}" ${f === entry.folder ? 'selected' : ''}>${f}</option>`).join('');
    const keysStr = Array.isArray(entry.keys) ? entry.keys.join(', ') : entry.keys;

    showModal({
        title: "编辑条目",
        body: `
            <select id="wb-edit-folder" class="modal-select">${folderOptions}</select>
            <input type="text" id="wb-edit-keys" class="modal-input" value="${keysStr}" placeholder="关键字">
            <textarea id="wb-edit-content" class="modal-textarea" placeholder="内容">${entry.content || entry.entry || ''}</textarea>
        `,
        onConfirm: () => {
            const folder = document.getElementById('wb-edit-folder').value;
            const keysStr = document.getElementById('wb-edit-keys').value.trim();
            const content = document.getElementById('wb-edit-content').value.trim();
            
            const keys = keysStr.split(/[,，]/).map(k => k.trim()).filter(k => k);
            
            worldInfo[index].keys = keys;
            worldInfo[index].content = content;
            worldInfo[index].folder = folder;
            
            saveData();
            renderWorldBook();
            closeModal();
        }
    });
}

// 批量删除
function batchDelete() {
    if (selectedItems.size === 0) return alert("未选择任何项目");
    
    if (!confirm(`确定删除选中的 ${selectedItems.size} 项吗？`)) return;

    // 分离出要删除的文件夹和条目索引
    const foldersToDelete = [];
    const indicesToDelete = [];
    
    selectedItems.forEach(item => {
        if (typeof item === 'string' && item.startsWith('folder:')) {
            foldersToDelete.push(item.split(':')[1]);
        } else if (typeof item === 'number') {
            indicesToDelete.push(item);
        }
    });

    // 删除条目 (从后往前删，防止索引偏移)
    indicesToDelete.sort((a, b) => b - a);
    indicesToDelete.forEach(idx => {
        worldInfo.splice(idx, 1);
    });

    // 删除文件夹
    foldersToDelete.forEach(f => {
        const idx = folders.indexOf(f);
        if (idx > -1) folders.splice(idx, 1);
    });

    saveData();
    toggleBatchMode(); // 退出批量模式
}

// 批量移动
function batchMove() {
    const indicesToMove = [];
    selectedItems.forEach(item => {
        if (typeof item === 'number') indicesToMove.push(item);
    });
    
    if (indicesToMove.length === 0) return alert("请选择要移动的条目");

    let folderOptions = folders.map(f => `<option value="${f}">${f}</option>`).join('');
    
    showModal({
        title: "移动到...",
        body: `<select id="move-target-folder" class="modal-select">${folderOptions}</select>`,
        onConfirm: () => {
            const targetFolder = document.getElementById('move-target-folder').value;
            indicesToMove.forEach(idx => {
                if (worldInfo[idx]) worldInfo[idx].folder = targetFolder;
            });
            saveData();
            toggleBatchMode();
            closeModal();
        }
    });
}

// 批量复制
function batchCopy() {
    const indicesToCopy = [];
    selectedItems.forEach(item => {
        if (typeof item === 'number') indicesToCopy.push(item);
    });
    
    if (indicesToCopy.length === 0) return alert("请选择要复制的条目");

    let folderOptions = folders.map(f => `<option value="${f}">${f}</option>`).join('');
    
    showModal({
        title: "复制到...",
        body: `<select id="copy-target-folder" class="modal-select">${folderOptions}</select>`,
        onConfirm: () => {
            const targetFolder = document.getElementById('copy-target-folder').value;
            indicesToCopy.forEach(idx => {
                if (worldInfo[idx]) {
                    const newEntry = JSON.parse(JSON.stringify(worldInfo[idx]));
                    newEntry.folder = targetFolder;
                    worldInfo.push(newEntry);
                }
            });
            saveData();
            toggleBatchMode();
            closeModal();
        }
    });
}

// --- 模态框逻辑 ---
function showModal({ title, body, onConfirm }) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-overlay').style.display = 'flex';
    
    const confirmBtn = document.getElementById('modal-confirm-btn');
    // 移除旧的监听器 (简单粗暴的方法：克隆节点)
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    
    newBtn.onclick = onConfirm;
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// --- API 交互 ---
async function fetchModels() {
    const inputEndpoint = document.getElementById('setting-endpoint');
    const inputApiKey = document.getElementById('setting-apikey');
    const connectBtn = document.getElementById('connect-btn');
    const modelContainer = document.getElementById('model-selector-container');

    const rawUrl = inputEndpoint.value.trim(); 
    const rawKey = inputApiKey.value;
    const cleanKey = sanitizeInput(rawKey); 
    const cleanUrl = rawUrl.replace(/\/+$/, ""); 

    if (!cleanUrl) { alert("请先填写接口地址！"); return; }
    
    connectBtn.innerText = "⏳...";
    connectBtn.disabled = true;

    let fetchUrl = `${cleanUrl}/v1/models`;
    if (cleanUrl.endsWith('/v1')) fetchUrl = `${cleanUrl}/models`;
    else if (!cleanUrl.includes('/v1')) fetchUrl = `${cleanUrl}/v1/models`;

    try {
        const headers = {};
        if (cleanKey) headers['Authorization'] = `Bearer ${cleanKey}`;

        let res;
        try {
            res = await fetch(fetchUrl, { method: 'GET', headers: headers });
        } catch(e) {
             res = await fetch(fetchUrl, { method: 'POST', headers: headers });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        let models = [];
        if (data.data && Array.isArray(data.data)) models = data.data.map(m => m.id);
        else if (Array.isArray(data)) models = data.map(m => m.id || m);

        if (models.length === 0) throw new Error("未找到模型");

        let selectHtml = `<select id="setting-model" style="width:100%; height:40px; font-size:17px; background:transparent; color:#007aff; border:none; outline:none;">`;
        models.forEach(m => { selectHtml += `<option value="${m}">${m}</option>`; });
        selectHtml += `</select>`;
        
        modelContainer.innerHTML = selectHtml;
        const inputModel = document.getElementById('setting-model'); 
        if (models.length > 0) inputModel.value = models[0];

        connectBtn.innerText = "✅ 已拉取";
        connectBtn.style.backgroundColor = "#34c759";
        
    } catch (e) {
        console.error(e);
        connectBtn.innerText = "❌ 失败";
        connectBtn.style.backgroundColor = "#ff3b30";
        alert(`拉取失败: ${e.message}\n请手动输入模型名。`);
    } finally {
        connectBtn.disabled = false;
    }
}

// 辅助函数：延时
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 显示/隐藏“正在输入”动画
function toggleTypingIndicator(show) {
    const chatWindow = document.getElementById('chat-window');
    let indicator = document.getElementById('typing-indicator');
    
    if (show) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'typing-indicator';
            indicator.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatWindow.appendChild(indicator);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    } else {
        if (indicator) indicator.remove();
    }
}

// 智能拆分回复
function smartSplitMessage(text) {
    // 1. 按换行符拆分
    let segments = text.split('\n').filter(s => s.trim());
    
    // 2. 进一步拆分过长的段落
    let finalSegments = [];
    segments.forEach(seg => {
        if (seg.length > 50 && /[。！!？?]/.test(seg)) {
            // 尝试按句号等标点拆分，但保留标点
            // 使用正则 lookbehind (部分浏览器支持) 或简单的 replace 技巧
            // 这里简单处理：将标点替换为 标点+特殊分隔符
            const temp = seg.replace(/([。！!？?])/g, '$1|||SPLIT|||');
            const subSegs = temp.split('|||SPLIT|||').filter(s => s.trim());
            finalSegments.push(...subSegs);
        } else {
            finalSegments.push(seg);
        }
    });
    
    return finalSegments;
}

async function callLLM() {
    if (!currentChatId || !chatSessions[currentChatId]) return;
    const session = chatSessions[currentChatId];
    const char = characters[session.characterId];
    if (!char) return;

    const sendBtn = document.getElementById('send-btn');
    const callBtn = document.getElementById('call-btn');

    // 禁用按钮
    sendBtn.disabled = true;
    callBtn.disabled = true;
    
    // 显示正在输入
    toggleTypingIndicator(true);

    let url = `${baseUrl}/v1/chat/completions`;
    if (baseUrl.endsWith('/v1')) url = `${baseUrl}/chat/completions`;
    const cleanKey = sanitizeInput(apiKey);

    // 1. 构建消息列表：System Prompt + History
    let messagesToSend = [];

    // User Info (从当前面具获取)
    const currentPersona = userPersonas.find(p => p.id === currentPersonaId) || {};

    // --- 注入核心 System Prompt ---
    const userName = currentPersona.userName || 'User';
    const charName = char.name || 'Character';

    let coreSystemPrompt = SYSTEM_PROMPT_TEMPLATE
        .replace(/{{char}}/g, charName)
        .replace(/{{user}}/g, userName);

    messagesToSend.push({ role: "system", content: coreSystemPrompt });
    // -----------------------------
    
    // System Prompt (包含角色设定 + 附加信息)
    let systemContent = char.prompt || "";
    
    if (currentPersona.userName || currentPersona.userPersona) {
        systemContent += `\n\n[User Info]\nName: ${currentPersona.userName || 'User'}\nDescription: ${currentPersona.userPersona || ''}`;
    }

    // World Info (只注入 enabled === true 的条目)
    const enabledWI = worldInfo.filter(e => e.enabled !== false);
    if (enabledWI.length > 0) {
        systemContent += `\n\n[World Info]\n`;
        enabledWI.forEach(entry => {
            const keys = Array.isArray(entry.keys) ? entry.keys.join(', ') : entry.keys;
            const content = entry.content || entry.entry || '';
            systemContent += `Keys: ${keys}\nContent: ${content}\n---\n`;
        });
    }

    messagesToSend.push({ role: "system", content: systemContent });

    // History (从 session.messages 获取)
    // 注意：session.messages 里不包含 system prompt
    messagesToSend = messagesToSend.concat(session.messages);

    // 调试
    console.log("Sending to LLM:", messagesToSend);

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (cleanKey) headers['Authorization'] = `Bearer ${cleanKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                model: modelName,
                messages: messagesToSend,
                temperature: 0.7,
                stream: false 
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        let aiText = "";
        if (data.choices && data.choices[0] && data.choices[0].message) aiText = data.choices[0].message.content;
        else if (data.content) aiText = data.content; 
        else aiText = JSON.stringify(data);
        
        // 拟人化分段发送
        const segments = smartSplitMessage(aiText);
        
        for (const seg of segments) {
            // 模拟打字时间
            const typingTime = 500 + seg.length * (Math.random() * 50 + 50);
            
            toggleTypingIndicator(true);
            await delay(typingTime);
            
            toggleTypingIndicator(false);
            addMessageToUI(seg, 'ai');

            // 存入会话历史
            session.messages.push({ role: "assistant", content: seg, timestamp: Date.now() });
            session.lastMessageTime = Date.now();
            saveData();
        }

    } catch (error) {
        toggleTypingIndicator(false);
        addMessageToUI(`❌ ${error.message}`, 'ai');
    } finally {
        sendBtn.disabled = false;
        callBtn.disabled = false;
    }
}

// --- 角色卡导入逻辑 ---
function importCharacter(file) {
    if (!file) return;
    const reader = new FileReader();

    const processJson = (json) => {
        // 兼容 V1 和 V2 格式
        const charData = json.data || json;
        const name = charData.name || "Unknown";
        const description = charData.description || "";
        const personality = charData.personality || "";
        const first_mes = charData.first_mes || "";
        const scenario = charData.scenario || "";
        
        let prompt = `Name: ${name}\n\nDescription:\n${description}\n\nPersonality:\n${personality}\n\nScenario:\n${scenario}`;
        
        // 创建新角色 (仅存入 characters 库)
        const newId = generateUUID();
        characters[newId] = {
            id: newId,
            name: name,
            avatar: "", // 如果是 JSON 导入，可能没有头像，或者需要后续处理
            prompt: prompt,
            firstMes: first_mes
        };

        // 处理世界书 (character_book)
        if (charData.character_book && charData.character_book.entries) {
            const entries = charData.character_book.entries;
            let addedCount = 0;
            
            if (!folders.includes(name)) folders.push(name);

            entries.forEach(entry => {
                const entryKeys = Array.isArray(entry.keys) ? entry.keys.join(',') : entry.keys;
                const exists = worldInfo.some(e => {
                    const eKeys = Array.isArray(e.keys) ? e.keys.join(',') : e.keys;
                    return eKeys === entryKeys;
                });

                if (!exists) {
                    entry.enabled = true;
                    entry.folder = name;
                    worldInfo.push(entry);
                    addedCount++;
                }
            });
            if (addedCount > 0) {
                alert(`已导入 ${addedCount} 条世界书条目到文件夹 "${name}"。`);
            }
        }

        saveData();
        alert(`角色 "${name}" 已添加到通讯录！`);
        
        // 跳转到通讯录 Tab
        MapsTo('app-main');
        switchMainTab('contacts');
    };

    if (file.name.endsWith('.json')) {
        reader.onload = (e) => {
            try { processJson(JSON.parse(e.target.result)); } 
            catch (err) { alert("JSON 解析失败: " + err.message); }
        };
        reader.readAsText(file);
    } else if (file.name.endsWith('.png')) {
        reader.onload = (e) => {
            try {
                const tags = ExifReader.load(e.target.result);
                let charaData = null;

                if (tags['chara']) charaData = tags['chara'].description;
                else if (tags['tEXt'] && tags['tEXt'].chara) charaData = tags['tEXt'].chara;
                else {
                    for (const key in tags) {
                        if (key.toLowerCase().includes('chara') && tags[key].description) {
                             charaData = tags[key].description;
                             break;
                        }
                        if (tags[key].description && isBase64(tags[key].description)) {
                             try {
                                 const decoded = atob(tags[key].description);
                                 if (decoded.includes('"name"')) {
                                     charaData = tags[key].description;
                                     break;
                                 }
                             } catch(e) {}
                        }
                    }
                }

                if (!charaData) {
                    alert("未在 PNG 中找到角色数据。");
                    return;
                }

                // 提取头像 Base64
                // 注意：ExifReader 不直接提供图片 Base64，我们需要重新读取文件
                // 这里我们先解析数据，然后再读一次文件作为头像
                const jsonStr = atob(charaData);
                const jsonData = JSON.parse(jsonStr);
                
                // 再次读取文件以获取头像
                const imgReader = new FileReader();
                imgReader.onload = (evt) => {
                    const base64Avatar = evt.target.result;
                    
                    // 手动注入头像到 processJson 逻辑中
                    // 由于 processJson 是闭包，我们稍微修改一下逻辑：
                    // 直接在这里执行 processJson 的核心部分
                    
                    const charData = jsonData.data || jsonData;
                    const name = charData.name || "Unknown";
                    const description = charData.description || "";
                    const personality = charData.personality || "";
                    const first_mes = charData.first_mes || "";
                    const scenario = charData.scenario || "";
                    
                    let prompt = `Name: ${name}\n\nDescription:\n${description}\n\nPersonality:\n${personality}\n\nScenario:\n${scenario}`;
                    
                    const newId = generateUUID();
                    characters[newId] = {
                        id: newId,
                        name: name,
                        avatar: base64Avatar, // 保存头像
                        prompt: prompt,
                        firstMes: first_mes
                    };
                    
                    // 处理世界书 (同上)
                    if (charData.character_book && charData.character_book.entries) {
                        const entries = charData.character_book.entries;
                        if (!folders.includes(name)) folders.push(name);
                        entries.forEach(entry => {
                            const entryKeys = Array.isArray(entry.keys) ? entry.keys.join(',') : entry.keys;
                            const exists = worldInfo.some(e => {
                                const eKeys = Array.isArray(e.keys) ? e.keys.join(',') : e.keys;
                                return eKeys === entryKeys;
                            });
                            if (!exists) {
                                entry.enabled = true;
                                entry.folder = name;
                                worldInfo.push(entry);
                            }
                        });
                    }

                    saveData();
                    alert(`角色 "${name}" 已添加到通讯录！`);
                    MapsTo('app-main');
                    switchMainTab('contacts');
                };
                imgReader.readAsDataURL(file);

            } catch (err) {
                console.error(err);
                alert("读取 PNG 失败: " + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("不支持的文件格式");
    }
}

// 世界书导入 (单独的导入功能)
function importWorldBook(file) {
    if (!file) return;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            // 支持 SillyTavern 格式 (entries 数组) 或直接是数组
            const entries = json.entries || (Array.isArray(json) ? json : []);
            
            if (entries.length === 0) return alert("未找到有效的世界书条目");
            
            // 询问导入到哪个文件夹
            let folderOptions = folders.map(f => `<option value="${f}">${f}</option>`).join('');
            // 添加新建选项
            folderOptions += `<option value="__NEW__">+ 新建文件夹...</option>`;
            
            showModal({
                title: "导入到文件夹",
                body: `<select id="import-target-folder" class="modal-select" onchange="if(this.value=='__NEW__') document.getElementById('import-new-folder-input').style.display='block'; else document.getElementById('import-new-folder-input').style.display='none';">${folderOptions}</select>
                       <input type="text" id="import-new-folder-input" class="modal-input" style="display:none;" placeholder="新文件夹名称">`,
                onConfirm: () => {
                    let targetFolder = document.getElementById('import-target-folder').value;
                    if (targetFolder === '__NEW__') {
                        targetFolder = document.getElementById('import-new-folder-input').value.trim();
                        if (!targetFolder) return alert("请输入文件夹名称");
                        if (!folders.includes(targetFolder)) folders.push(targetFolder);
                    }
                    
                    let addedCount = 0;
                    entries.forEach(entry => {
                        // 简单去重
                        const entryKeys = Array.isArray(entry.keys) ? entry.keys.join(',') : entry.keys;
                        const exists = worldInfo.some(e => {
                            const eKeys = Array.isArray(e.keys) ? e.keys.join(',') : e.keys;
                            return eKeys === entryKeys;
                        });
                        
                        if (!exists) {
                            entry.enabled = true;
                            entry.folder = targetFolder;
                            worldInfo.push(entry);
                            addedCount++;
                        }
                    });
                    
                    saveData();
                    renderWorldBook();
                    closeModal();
                    alert(`成功导入 ${addedCount} 条目`);
                }
            });
            
        } catch (err) {
            alert("导入失败: " + err.message);
        }
    };
    reader.readAsText(file);
}

function isBase64(str) {
    try { return btoa(atob(str)) == str; } catch (err) { return false; }
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateClock();

    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const listImportInput = document.getElementById('list-import-input');
    const userAvatarInput = document.getElementById('user-avatar-input');
    const wbImportInput = document.getElementById('wb-import-input');

    const callBtn = document.getElementById('call-btn');

    if (sendBtn && userInput && callBtn) {
        // 发送/上屏按钮：仅上屏，不触发 AI
        sendBtn.addEventListener('click', () => {
            const text = userInput.value.trim();
            if (!text) return;
            if (!currentChatId || !chatSessions[currentChatId]) return;

            addMessageToUI(text, 'user');
            userInput.value = '';
            
            const session = chatSessions[currentChatId];
            session.messages.push({ role: "user", content: text });
            session.lastMessageTime = Date.now();
            saveData();
            
            // 滚动到底部
            const chatWindow = document.getElementById('chat-window');
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });

        // 呼叫 AI 按钮：触发回复
        callBtn.addEventListener('click', () => {
            if (!currentChatId) return;
            // 如果输入框有内容，先发送
            const text = userInput.value.trim();
            if (text) {
                sendBtn.click();
                // 给一点时间让 DOM 更新
                setTimeout(callLLM, 100);
            } else {
                callLLM();
            }
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                sendBtn.click(); 
            }
        });
    }

    if (listImportInput) {
        listImportInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importCharacter(e.target.files[0]);
                e.target.value = '';
            }
        });
    }

    if (wbImportInput) {
        wbImportInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importWorldBook(e.target.files[0]);
                e.target.value = '';
            }
        });
    }

    const backupImportInputSettings = document.getElementById('backup-import-input-settings');
    if (backupImportInputSettings) {
        backupImportInputSettings.addEventListener('change', (e) => {
            importData(e.target);
        });
    }

    if (userAvatarInput) {
        userAvatarInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                compressImage(file, 300).then(base64 => {
                    // 注意：这里可能是旧版逻辑，新版逻辑在 handleAvatarUpload 中处理
                    // 但为了兼容性，这里也更新一下
                    // 如果是在“我的”页面，通常会触发 handleAvatarUpload
                    // 但如果是 DOMContentLoaded 里的这个监听器，可能是为了兼容旧的直接绑定
                    
                    // 检查是否在“我的”页面，如果是，可能已经由 handleAvatarUpload 处理了
                    // 但 handleAvatarUpload 是绑定在 input 上的，这里也是绑定在 input 上的
                    // 为了避免冲突，我们只保留一个有效的处理逻辑。
                    // 实际上，loadUserProfileUI 会重新绑定 input 的 change 事件到 handleAvatarUpload
                    // 而这里的 DOMContentLoaded 也会绑定。
                    // 最好是统一逻辑。
                    
                    // 由于 loadUserProfileUI 是动态生成的，这里的 userAvatarInput 可能是初始 HTML 中的
                    // 但 loadUserProfileUI 会清空容器并重新生成 input，所以这里的绑定可能会失效
                    // 除非 userAvatarInput 是静态存在的。
                    // 查看 index.html，userAvatarInput 是在 settings-container 里的，
                    // 而 loadUserProfileUI 会清空 settings-container。
                    // 所以 DOMContentLoaded 里的这个绑定只对初始静态 HTML 有效，
                    // 一旦 loadUserProfileUI 运行，input 就被替换了。
                    
                    // 不过为了保险，还是加上压缩逻辑
                    userInfo.avatar = base64;
                    const preview = document.getElementById('user-avatar-preview');
                    if (preview) {
                        preview.style.backgroundImage = `url(${base64})`;
                        preview.innerText = "";
                    }
                    saveData(); 
                }).catch(err => {
                    console.error("图片压缩失败", err);
                });
            }
        });
    }
});
