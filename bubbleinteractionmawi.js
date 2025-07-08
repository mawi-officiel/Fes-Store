// v3
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
            if (!e.target.closest('.mawi-context-menu')) {
                this.hideContextMenu();
                this.createBubbles(e);
                this.createRipple(e);
            }
        });

        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                this.createBubbles(e);
            }
        });

        document.addEventListener('scroll', () => {
            this.hideContextMenu();
        });

        document.addEventListener('mouseup', () => {
            this.selectedText = window.getSelection().toString();
            this.updateContextMenu();
        });
    }

    setupContextMenu() {
        const home = document.getElementById('mawiHomePage');
        const cart = document.getElementById('mawiCartPage');
        const copy = document.getElementById('mawiCopyText');
        const paste = document.getElementById('mawiPasteText');

        if (home) {
            home.addEventListener('click', () => {
                window.location.href = 'https://fes-store.com/';
                this.hideContextMenu();
            });
        }

        if (cart) {
            cart.addEventListener('click', () => {
                window.location.href = 'https://fes-store.com/cart';
                this.hideContextMenu();
            });
        }

        if (copy) {
            copy.addEventListener('click', () => {
                if (this.selectedText) {
                    this.copyToClipboard(this.selectedText);
                } else {
                    this.showNotification('❌ لا يوجد نص محدد لنسخه');
                }
                this.hideContextMenu();
            });
        }

        if (paste) {
            paste.addEventListener('click', () => {
                if (this.clipboard) {
                    this.pasteFromClipboard();
                } else {
                    this.showNotification('⚠️ لا يوجد نص محفوظ للّصق');
                }
                this.hideContextMenu();
            });
        }
    }

    showContextMenu(event) {
        if (!this.contextMenu) return;

        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = `${event.clientX}px`;
        this.contextMenu.style.top = `${event.clientY}px`;

        const rect = this.contextMenu.getBoundingClientRect();

        if (rect.right > window.innerWidth) {
            this.contextMenu.style.left = `${event.clientX - rect.width}px`;
        }

        if (rect.bottom > window.innerHeight) {
            this.contextMenu.style.top = `${event.clientY - rect.height}px`;
        }

        this.updateContextMenu();
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
        }
    }

    updateContextMenu() {
        const copyItem = document.getElementById('mawiCopyText');
        const pasteItem = document.getElementById('mawiPasteText');

        if (copyItem) {
            copyItem.classList.toggle('mawi-disabled', !this.selectedText);
        }

        if (pasteItem) {
            pasteItem.classList.toggle('mawi-disabled', !this.clipboard);
        }
    }

    copyToClipboard(text) {
        this.clipboard = text;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => this.showNotification('✅ تم نسخ النص بنجاح'))
                .catch(() => this.fallbackCopyTextToClipboard(text));
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification('✅ تم نسخ النص بنجاح');
            } else {
                this.showNotification('❌ لم يتم النسخ');
            }
        } catch (err) {
            this.showNotification('⚠️ فشل النسخ');
        }

        document.body.removeChild(textarea);
    }

    pasteFromClipboard() {
        const activeElement = document.activeElement;

        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const text = activeElement.value;

            activeElement.value = text.slice(0, start) + this.clipboard + text.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + this.clipboard.length;

            this.showNotification('📋 تم اللصق داخل الحقل');
        } else {
            this.showNotification('📋 تم اللصق: ' + this.clipboard);
        }
    }

    createBubbles(event) {
        const bubbleCount = Math.floor(Math.random() * 8) + 5;

        for (let i = 0; i < bubbleCount; i++) {
            setTimeout(() => {
                this.createSingleBubble(event);
            }, i * 50);
        }
    }

    createSingleBubble(event) {
        const bubble = document.createElement('div');
        bubble.className = 'mawi-bubble';

        const sizes = [20, 25, 30, 35, 40, 45];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        const colors = [
            '#CBAC52',
            'rgba(203, 172, 82, 0.8)',
            'rgba(203, 172, 82, 0.6)',
            'rgba(230, 200, 102, 0.8)',
            'rgba(255, 215, 0, 0.7)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${event.clientX + offsetX}px`;
        bubble.style.top = `${event.clientY + offsetY}px`;
        bubble.style.position = 'absolute';
        bubble.style.borderRadius = '50%';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '1000';
        bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, rgba(203, 172, 82, 0.3))`;
        bubble.style.boxShadow = `0 0 20px ${color}`;
        bubble.style.animation = 'mawi-bubble-float 1.5s ease-out forwards';

        document.body.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 1500);
    }

    createRipple(event) {
        const ripple = document.createElement('div');
        ripple.className = 'mawi-ripple';

        const size = 50;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - size / 2}px`;
        ripple.style.top = `${event.clientY - size / 2}px`;

        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(203, 172, 82, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '999';
        ripple.style.animation = 'mawi-ripple-effect 0.6s ease-out';

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.background = '#CBAC52';
        notification.style.color = '#1a1a1a';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '10001';
        notification.style.boxShadow = '0 4px 15px rgba(203, 172, 82, 0.4)';
        notification.style.fontWeight = 'bold';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new MawiBubbleSystem();
});
