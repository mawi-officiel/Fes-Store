// 3.5.0
// dev. Mawi

// إدراج CSS ديناميكيًا (مبسّط بدون مؤثرات)
const mawiStyle = document.createElement('style');
mawiStyle.innerHTML = `
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
        transition: background 0.3s ease;
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
    }
    .mawi-context-item.mawi-disabled {
        opacity: 0.4;
        color: #666;
        cursor: not-allowed;
    }
    .mawi-context-item.mawi-disabled:hover {
        background: transparent;
    }
    .mawi-icon {
        width: 20px;
        height: 20px;
        fill: #CBAC52;
    }
    .mawi-context-item:hover .mawi-icon {
        fill: #8B7B3A;
    }
    .mawi-context-item.mawi-disabled .mawi-icon {
        fill: #999;
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
    <div class="mawi-context-item" id="mawiWishlistPage">
        <svg class="mawi-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        <span>قائمة الرغبات</span>
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

// النظام بدون مؤثرات
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
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mawi-context-menu')) {
                this.hideContextMenu();
            }
        });
        document.addEventListener('scroll', () => this.hideContextMenu());
        document.addEventListener('mouseup', () => {
            this.selectedText = window.getSelection().toString();
            this.updateContextMenu();
        });
    }

    setupContextMenu() {
        document.getElementById('mawiHomePage').onclick = () => {
            window.location.href = 'https://fes-store.com/';
            this.hideContextMenu();
        };
        document.getElementById('mawiCartPage').onclick = () => {
            window.location.href = 'https://fes-store.com/cart';
            this.hideContextMenu();
        };
        document.getElementById('mawiWishlistPage').onclick = () => {
            window.location.href = 'https://fes-store.com/wishlist';
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
            navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
    }

    pasteFromClipboard() {
        const active = document.activeElement;
        if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
            const { selectionStart, selectionEnd, value } = active;
            active.value = value.slice(0, selectionStart) + this.clipboard + value.slice(selectionEnd);
            active.selectionStart = active.selectionEnd = selectionStart + this.clipboard.length;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new MawiBubbleSystem());


document.addEventListener('DOMContentLoaded', () => new MawiBubbleSystem());
