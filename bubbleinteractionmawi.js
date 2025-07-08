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
        // منع القائمة الافتراضية
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
            this.createBubbles(e);
        });

        // النقر بالزر الأيسر
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mawi-context-menu')) {
                this.hideContextMenu();
                this.createBubbles(e);
                this.createRipple(e);
            }
        });

        // النقر بالزر الأيمن
        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                this.createBubbles(e);
            }
        });

        // إخفاء القائمة عند التمرير
        document.addEventListener('scroll', () => {
            this.hideContextMenu();
        });

        // تحديث النص المحدد
        document.addEventListener('mouseup', () => {
            this.selectedText = window.getSelection().toString();
            this.updateContextMenu();
        });
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

        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = (event.clientX + offsetX) + 'px';
        bubble.style.top = (event.clientY + offsetY) + 'px';
        bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, rgba(203, 172, 82, 0.3))`;
        bubble.style.boxShadow = `0 0 20px ${color}`;

        document.body.appendChild(bubble);

        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 1500);
    }

    createRipple(event) {
        const ripple = document.createElement('div');
        ripple.className = 'mawi-ripple';

        const size = 50;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - size / 2) + 'px';
        ripple.style.top = (event.clientY - size / 2) + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupContextMenu() {
        const home = document.getElementById('mawiHomePage');
        const cart = document.getElementById('mawiCartPage');
        const copy = document.getElementById('mawiCopyText');
        const paste = document.getElementById('mawiPasteText');

        if (home) {
            home.addEventListener('click', () => {
                window.open('https://fes-store.com/', '_blank');
                this.hideContextMenu();
            });
        }

        if (cart) {
            cart.addEventListener('click', () => {
                window.open('https://fes-store.com/cart', '_blank');
                this.hideContextMenu();
            });
        }

        if (copy) {
            copy.addEventListener('click', () => {
                if (this.selectedText) {
                    this.copyToClipboard(this.selectedText);
                }
                this.hideContextMenu();
            });
        }

        if (paste) {
            paste.addEventListener('click', () => {
                if (this.clipboard) {
                    this.pasteFromClipboard();
                }
                this.hideContextMenu();
            });
        }
    }

    showContextMenu(event) {
        if (!this.contextMenu) return;

        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = event.clientX + 'px';
        this.contextMenu.style.top = event.clientY + 'px';

        const rect = this.contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            this.contextMenu.style.left = (event.clientX - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            this.contextMenu.style.top = (event.clientY - rect.height) + 'px';
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

        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('تم نسخ النص بنجاح!');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            this.showNotification('تم نسخ النص بنجاح!');
        } catch (err) {
            this.showNotification('فشل في نسخ النص');
        }

        document.body.removeChild(textArea);
    }

    pasteFromClipboard() {
        if (!this.clipboard) return;

        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const start = activeElement.selectionStart;
            const end = activeElement.selectionEnd;
            const text = activeElement.value;
            activeElement.value = text.slice(0, start) + this.clipboard + text.slice(end);
            activeElement.selectionStart = activeElement.selectionEnd = start + this.clipboard.length;
        } else {
            this.showNotification('تم لصق النص: ' + this.clipboard);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
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
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            notification.style.transition = 'all 0.3s ease';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new MawiBubbleSystem();
});
