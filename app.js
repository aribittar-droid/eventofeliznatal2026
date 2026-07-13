document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CONFIGURATIONS & CONSTANTS
    // ==========================================================================
    const EVENT_DATE = new Date('2026-08-17T19:00:00');
    const LOCAL_STORAGE_KEY = 'rsvp_feliz_natal_2026';
    // WhatsApp default text message (will be encoded dynamically)
    const WHATSAPP_BASE_MSG = 'Olá! Gostaria de confirmar minha presença no Encontro Técnico Inovagro sobre "Gerenciamento de Risco para Anos de El Niño".';

    // DOM Elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccessCard = document.getElementById('rsvp-success');
    const submitBtn = document.getElementById('btn-submit');
    const btnWhatsappConfirm = document.getElementById('btn-whatsapp-confirm');
    const btnResetRsvp = document.getElementById('btn-reset-rsvp');

    // ==========================================================================
    // COUNTDOWN TIMER LOGIC
    // ==========================================================================
    function updateCountdown() {
        const now = new Date();
        const difference = EVENT_DATE - now;

        if (difference <= 0) {
            // Event has started or passed
            if (daysEl) daysEl.innerText = '00';
            if (hoursEl) hoursEl.innerText = '00';
            if (minutesEl) minutesEl.innerText = '00';
            if (secondsEl) secondsEl.innerText = '00';
            
            const timerContainer = document.getElementById('countdown-timer');
            if (timerContainer) {
                timerContainer.style.opacity = '0.7';
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update elements with leading zeros
        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    // Initial run and interval
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ==========================================================================
    // RSVP FORM & LOCALSTORAGE LOGIC
    // ==========================================================================
    
    // Check if user has already RSVP'd
    const savedRSVP = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedRSVP) {
        try {
            const rsvpData = JSON.parse(savedRSVP);
            showSuccess(rsvpData);
        } catch (e) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }

    // Form Submit Event
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Start loading animation
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Get values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const property = document.getElementById('property').value.trim();
        const guestsSelect = document.getElementById('guests');
        const guestsText = guestsSelect.options[guestsSelect.selectedIndex].text;
        const guestsVal = guestsSelect.value;

        const rsvpData = {
            name,
            phone,
            property,
            guestsText,
            guestsVal,
            confirmedAt: new Date().toISOString()
        };

        // Simulate network delay for a more premium interaction feel
        setTimeout(() => {
            // Save to LocalStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rsvpData));
            
            // Turn off loading
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Show success screen
            showSuccess(rsvpData);
        }, 1200);
    });

    // Reset Form Event
    btnResetRsvp.addEventListener('click', () => {
        // Clear LocalStorage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        
        // Reset and show form
        rsvpForm.reset();
        rsvpSuccessCard.hidden = true;
        rsvpForm.style.display = 'flex';
        rsvpForm.style.animation = 'fadeInUp 0.3s ease forwards';
    });

    // Helper function to display success card and configure WhatsApp button
    function showSuccess(data) {
        // Hide form
        rsvpForm.style.display = 'none';
        
        // Show success card
        rsvpSuccessCard.hidden = false;

        // Configurar o link do WhatsApp direcionado para o número fornecido (+5566999429100)
        // Formatamos a mensagem de forma limpa em tópicos
        const formattedMsg = `${WHATSAPP_BASE_MSG}\n\n*Dados de Confirmação:*\n📌 *Nome:* ${data.name}\n📞 *WhatsApp:* ${data.phone}\n🚜 *Fazenda:* ${data.property}\n👥 *Acompanhantes:* ${data.guestsText}`;
        
        const encodedMsg = encodeURIComponent(formattedMsg);
        btnWhatsappConfirm.href = `https://wa.me/5566999429100?text=${encodedMsg}`;
    }

    // Simple phone number auto-formatting (Brazilian standard)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        if (!x[2]) {
            e.target.value = x[1];
        } else {
            e.target.value = `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
        }
    });

    // ==========================================================================
    // LOGICA DO SELETOR DE TEMAS E LAYOUT
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeOptionsPanel = document.getElementById('theme-options-panel');
    const themeOptBtns = document.querySelectorAll('.theme-opt-btn');
    const layoutOptBtns = document.querySelectorAll('.layout-opt-btn');
    
    // Elementos de Modal do RSVP
    const rsvpSection = document.getElementById('rsvp');
    const rsvpModalBackdrop = document.getElementById('rsvp-modal-backdrop');
    const btnOpenRsvp = document.getElementById('btn-open-rsvp');
    const btnCloseRsvp = document.getElementById('btn-close-rsvp');

    const THEME_STORAGE_KEY = 'rsvp_theme_feliz_natal';
    const LAYOUT_STORAGE_KEY = 'rsvp_layout_feliz_natal';

    // 1. Carregar Tema Salvo
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'default';
    setTheme(savedTheme);

    // 2. Carregar Layout Salvo
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY) || 'landing';
    setLayout(savedLayout);

    // Alternar painel de opções
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeOptionsPanel.classList.toggle('show');
    });

    // Fechar painel de opções ao clicar fora
    document.addEventListener('click', () => {
        themeOptionsPanel.classList.remove('show');
    });

    // Impedir fechamento ao clicar dentro do painel
    themeOptionsPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Tratar cliques nos temas de cores
    themeOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        });
    });

    // Tratar cliques nos formatos de layout
    layoutOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = btn.getAttribute('data-layout');
            setLayout(layout);
            localStorage.setItem(LAYOUT_STORAGE_KEY, layout);
            
            // Fechar modal ao trocar de layout
            closeRsvpModal();
        });
    });

    function setTheme(theme) {
        if (theme === 'default') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', theme);
        }

        // Atualizar classe ativa do botão de tema
        themeOptBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function setLayout(layout) {
        document.body.setAttribute('data-layout', layout);

        // Atualizar classe ativa do botão de layout
        layoutOptBtns.forEach(btn => {
            if (btn.getAttribute('data-layout') === layout) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // CONTROLES DO MODAL RSVP (Para Layout Card Compacto)
    // ==========================================================================
    if (btnOpenRsvp) {
        btnOpenRsvp.addEventListener('click', openRsvpModal);
    }
    
    if (btnCloseRsvp) {
        btnCloseRsvp.addEventListener('click', closeRsvpModal);
    }

    if (rsvpModalBackdrop) {
        rsvpModalBackdrop.addEventListener('click', closeRsvpModal);
    }

    function openRsvpModal() {
        if (rsvpSection) rsvpSection.classList.add('show');
        if (rsvpModalBackdrop) rsvpModalBackdrop.classList.add('show');
    }

    function closeRsvpModal() {
        if (rsvpSection) rsvpSection.classList.remove('show');
        if (rsvpModalBackdrop) rsvpModalBackdrop.classList.remove('show');
    }
});
