// 1.0.0
// dev. Mawi

// إدراج CSS ديناميكيًا
const mawiStyle = document.createElement('style');
mawiStyle.innerHTML = `
    .mawi-container {
        padding: 20px;
        text-align: center;
        color: #CBAC52;
    }
    .mawi-title {
        font-size: 2.5em;
        margin-bottom: 20px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .mawi-content {
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
        padding: 20px;
        background: rgba(203, 172, 82, 0.1);
        border-radius: 15px;
        border: 2px solid #CBAC52;
        margin-bottom: 40px;
    }
    ::-webkit-scrollbar {
        width: 12px;
    }
    ::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: #CBAC52;
        border-radius: 10px;
        border: 2px solid #1a1a1a;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #e6c866;
    }
    .mawi-bubble {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: mawi-bubble-float 1.5s ease-out forwards;
    }
    @keyframes mawi-bubble-float {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(0.8) rotate(360deg); opacity: 0; }
    }
    .mawi-context-menu {
        position: fixed;
        background: white;
        border: 2px solid #CBAC52;
        border-radius: 10px;
        padding: 5px 0;
        box-shadow: 0 10px 30px rgba(203, 172, 82, 0.3);
        z-index: 10000;
        display: none;
        min-width: 200px;
        backdrop-filter: blur(10px);
    }
    .mawi-context-item {
        padding: 12px 20px;
        color: black;
        cursor: pointer;
        border-bottom: 1px solid rgba(203, 172, 82, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
    }
    .mawi-context-item:last-child {
        border-bottom: none;
    }
    .mawi-context-item:hover {
        background: rgba(203, 172, 82, 0.15);
        transform: translateX(-5px);
    }
    .mawi-context-item.mawi-disabled {
        opacity: 0.4;
        color: #666;
        cursor: not-allowed;
    }
    .mawi-context-item.mawi-disabled:hover {
        background: transparent;
        transform: none;
    }
    .mawi-icon {
        width: 20px;
        height: 20px;
        fill: #CBAC52;
        transition: fill 0.3s ease;
    }
    .mawi-context-item:hover .mawi-icon {
        fill: #8B7B3A;
    }
    .mawi-context-item.mawi-disabled .mawi-icon {
        fill: #999;
    }
    .mawi-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(203, 172, 82, 0.3);
        pointer-events: none;
        z-index: 999;
        animation: mawi-ripple-effect 0.6s ease-out;
    }
    @keyframes mawi-ripple-effect {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(mawiStyle);

// إدراج HTML الخاص بالقائمة السياقية
const mawiHTML = `
<div class="mawi-context-menu" id="mawiContextMenu">
    <div class="mawi-context-item" id="mawiHomePage">
        <svg class="mawi-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>الصفحة الرئيسية</span>
    </div>
    <div class="mawi-context-item" id="mawiCartPage">
        <svg class="mawi-icon" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        <span>سلة التسوق</span>
    </div>
    <div class="mawi-context-item" id="mawiCopyText">
        <svg class="mawi-icon" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
        <span>نسخ</span>
    </div>
    <div class="mawi-context-item" id="mawiPasteText">
        <svg class="mawi-icon" viewBox="0 0 24 24"><path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"/></svg>
        <span>لصق</span>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', mawiHTML);

// كلاس النظام
class MawiBubbleSystem {
    constructor() {
        this.contextMenu = document.getElementById('mawiContextMenu');
        this.clipboard = '';
        this.selectedText = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupContextMenu();
    }

    setupEventListeners() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
            this.createBubbles(e);
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mawi-context-menu')) return;
            this.hideContextMenu();
            this.createBubbles(e);
            this.createRipple(e);
        });
        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) this.createBubbles(e);
        });
        document.addEventListener('scroll', () => {
            this.hideContextMenu();
        });
        document.addEventListener('mouseup', () => {
            this.selectedText = window.getSelection().toString();
            this.updateContextMenu();
        });
    }

    createBubbles(event) {
        const count = Math.floor(Math.random() * 8) + 5;
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createSingleBubble(event), i * 50);
        }
    }

    createSingleBubble(event) {
        const bubble = document.createElement('div');
        bubble.className = 'mawi-bubble';
        const size = [20, 25, 30, 35, 40, 45][Math.floor(Math.random() * 6)];
        const colors = ['#CBAC52', 'rgba(203, 172, 82, 0.8)', 'rgba(203, 172, 82, 0.6)', 'rgba(230, 200, 102, 0.8)', 'rgba(255, 215, 0, 0.7)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        Object.assign(bubble.style, {
            width: size + 'px',
            height: size + 'px',
            left: (event.clientX + offsetX) + 'px',
            top: (event.clientY + offsetY) + 'px',
            background: `radial-gradient(circle at 30% 30%, ${color}, rgba(203, 172, 82, 0.3))`,
            boxShadow: `0 0 20px ${color}`
        });
        document.body.appendChild(bubble);
        setTimeout(() => bubble.remove(), 1500);
    }

    createRipple(event) {
        const ripple = document.createElement('div');
        ripple.className = 'mawi-ripple';
        ripple.style.width = ripple.style.height = '50px';
        ripple.style.left = (event.clientX - 25) + 'px';
        ripple.style.top = (event.clientY - 25) + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    setupContextMenu() {
        document.getElementById('mawiHomePage').onclick = () => {
            window.open('https://fes-store.com/', '_blank');
            this.hideContextMenu();
        };
        document.getElementById('mawiCartPage').onclick = () => {
            window.open('https://fes-store.com/cart', '_blank');
            this.hideContextMenu();
        };
        document.getElementById('mawiCopyText').onclick = () => {
            if (this.selectedText) this.copyToClipboard(this.selectedText);
            this.hideContextMenu();
        };
        document.getElementById('mawiPasteText').onclick = () => {
            if (this.clipboard) this.pasteFromClipboard();
            this.hideContextMenu();
        };
    }

    showContextMenu(event) {
        const menu = this.contextMenu;
        menu.style.display = 'block';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (event.clientX - rect.width) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (event.clientY - rect.height) + 'px';
        this.updateContextMenu();
    }

    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }

    updateContextMenu() {
        const copy = document.getElementById('mawiCopyText');
        const paste = document.getElementById('mawiPasteText');
        copy.classList.toggle('mawi-disabled', !this.selectedText);
        paste.classList.toggle('mawi-disabled', !this.clipboard);
    }

    copyToClipboard(text) {
        this.clipboard = text;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => this.showNotification('تم نسخ النص بنجاح!'));
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            this.showNotification('تم نسخ النص بنجاح!');
        } catch {
            this.showNotification('فشل في نسخ النص');
        }
        textarea.remove();
    }

    pasteFromClipboard() {
        const active = document.activeElement;
        if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
            const { selectionStart, selectionEnd, value } = active;
            active.value = value.slice(0, selectionStart) + this.clipboard + value.slice(selectionEnd);
            active.selectionStart = active.selectionEnd = selectionStart + this.clipboard.length;
        } else {
            this.showNotification('تم لصق النص: ' + this.clipboard);
        }
    }

    showNotification(message) {
        const note = document.createElement('div');
        Object.assign(note.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#CBAC52',
            color: '#1a1a1a',
            padding: '15px 20px',
            borderRadius: '8px',
            zIndex: '10001',
            boxShadow: '0 4px 15px rgba(203, 172, 82, 0.4)',
            fontWeight: 'bold'
        });
        note.textContent = message;
        document.body.appendChild(note);
        setTimeout(() => {
            note.style.opacity = '0';
            note.style.transform = 'translateY(-20px)';
            note.style.transition = 'all 0.3s ease';
            setTimeout(() => note.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => new MawiBubbleSystem());
