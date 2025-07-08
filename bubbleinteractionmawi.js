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
                // منع قائمة السياق الافتراضية
                document.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.showContextMenu(e);
                    this.createBubbles(e);
                });

                // نقرة الزر الأيسر
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.mawi-context-menu')) return;
                    
                    this.hideContextMenu();
                    this.createBubbles(e);
                    this.createRipple(e);
                });

                // نقرة الزر الأيمن
                document.addEventListener('mousedown', (e) => {
                    if (e.button === 2) { // الزر الأيمن
                        this.createBubbles(e);
                    }
                });

                // إخفاء قائمة السياق عند التمرير
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
                const bubbleCount = Math.floor(Math.random() * 8) + 5; // 5-12 فقاعة
                
                for (let i = 0; i < bubbleCount; i++) {
                    setTimeout(() => {
                        this.createSingleBubble(event);
                    }, i * 50);
                }
            }

            createSingleBubble(event) {
                const bubble = document.createElement('div');
                bubble.className = 'mawi-bubble';
                
                // أحجام مختلفة للفقاعات
                const sizes = [20, 25, 30, 35, 40, 45];
                const size = sizes[Math.floor(Math.random() * sizes.length)];
                
                // ألوان مختلفة بدرجات اللون الذهبي
                const colors = [
                    '#CBAC52',
                    'rgba(203, 172, 82, 0.8)',
                    'rgba(203, 172, 82, 0.6)',
                    'rgba(230, 200, 102, 0.8)',
                    'rgba(255, 215, 0, 0.7)'
                ];
                
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                // موضع عشوائي حول النقطة المنقورة
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                
                bubble.style.width = size + 'px';
                bubble.style.height = size + 'px';
                bubble.style.left = (event.clientX + offsetX) + 'px';
                bubble.style.top = (event.clientY + offsetY) + 'px';
                bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, rgba(203, 172, 82, 0.3))`;
                bubble.style.boxShadow = `0 0 20px ${color}`;
                
                document.body.appendChild(bubble);
                
                // إزالة الفقاعة بعد انتهاء الحركة
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
                // الصفحة الرئيسية
                document.getElementById('mawiHomePage').addEventListener('click', () => {
                    window.open('https://fes-store.com/', '_blank');
                    this.hideContextMenu();
                });

                // سلة التسوق
                document.getElementById('mawiCartPage').addEventListener('click', () => {
                    window.open('https://fes-store.com/cart', '_blank');
                    this.hideContextMenu();
                });

                // نسخ النص
                document.getElementById('mawiCopyText').addEventListener('click', () => {
                    if (this.selectedText) {
                        this.copyToClipboard(this.selectedText);
                    }
                    this.hideContextMenu();
                });

                // لصق النص
                document.getElementById('mawiPasteText').addEventListener('click', () => {
                    if (this.clipboard) {
                        this.pasteFromClipboard();
                    }
                    this.hideContextMenu();
                });
            }

            showContextMenu(event) {
                this.contextMenu.style.display = 'block';
                this.contextMenu.style.left = event.clientX + 'px';
                this.contextMenu.style.top = event.clientY + 'px';
                
                // التأكد من عدم خروج القائمة من الشاشة
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
                this.contextMenu.style.display = 'none';
            }

            updateContextMenu() {
                const copyItem = document.getElementById('mawiCopyText');
                const pasteItem = document.getElementById('mawiPasteText');
                
                // تفعيل/إلغاء تفعيل زر النسخ
                if (this.selectedText) {
                    copyItem.classList.remove('mawi-disabled');
                } else {
                    copyItem.classList.add('mawi-disabled');
                }
                
                // تفعيل/إلغاء تفعيل زر اللصق
                if (this.clipboard) {
                    pasteItem.classList.remove('mawi-disabled');
                } else {
                    pasteItem.classList.add('mawi-disabled');
                }
            }

            copyToClipboard(text) {
                this.clipboard = text;
                
                // محاولة استخدام Clipboard API إذا كان متاحاً
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
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
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
                if (this.clipboard) {
                    // محاولة اللصق في العنصر النشط
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

        // تشغيل النظام عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            new MawiBubbleSystem();
        });
