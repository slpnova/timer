document.addEventListener('DOMContentLoaded', () => {
    // --- HTML Elementleri Seçimi ---
    const pomodoroBtn = document.getElementById('pomodoro-btn');
    const shortBreakBtn = document.getElementById('short-break-btn');
    const longBreakBtn = document.getElementById('long-break-btn');
    const displayMinutes = document.getElementById('display-minutes');
    const displaySeconds = document.getElementById('display-seconds');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const noTasksMessage = document.getElementById('no-tasks-message');
    const currentCharCount = document.getElementById('current-char-count');

    // --- Zamanlayıcı Değişkenleri ---
    let timerInterval;
    let totalSeconds = 0;
    let isRunning = false; // Zamanlayıcının çalışıp çalışmadığını gösterir
    let currentMode = 'pomodoro'; // Başlangıç modu

    // Pomodoro mod süreleri (saniye cinsinden)
    const POMODORO_TIME = 25 * 60; // 25 dakika
    const SHORT_BREAK_TIME = 5 * 60; // 5 dakika
    const LONG_BREAK_TIME = 15 * 60; // 15 dakika

    // --- Yardımcı Fonksiyonlar ---

    // Süreyi MM:SS formatında göstermek için
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return {
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(remainingSeconds).padStart(2, '0')
        };
    }

    // Zamanlayıcı ekranını güncelle
    function updateTimerDisplay() {
        const { minutes, seconds } = formatTime(totalSeconds);
        displayMinutes.textContent = minutes;
        displaySeconds.textContent = seconds;
    }

    // Mod butonlarını güncelle
    function setActiveButton(activeButton) {
        pomodoroBtn.classList.remove('active');
        shortBreakBtn.classList.remove('active');
        longBreakBtn.classList.remove('active');
        activeButton.classList.add('active');
    }

    // Modu ayarla ve zamanlayıcıyı sıfırla
    function setMode(mode) {
        currentMode = mode;
        clearInterval(timerInterval); // Mevcut zamanlayıcıyı durdur
        isRunning = false;
        startBtn.textContent = 'START'; // Buton metnini varsayılana çevir

        switch (mode) {
            case 'pomodoro':
                totalSeconds = POMODORO_TIME;
                setActiveButton(pomodoroBtn);
                break;
            case 'short-break':
                totalSeconds = SHORT_BREAK_TIME;
                setActiveButton(shortBreakBtn);
                break;
            case 'long-break':
                totalSeconds = LONG_BREAK_TIME;
                setActiveButton(longBreakBtn);
                break;
        }
        updateTimerDisplay();
    }

    // --- Zamanlayıcı Kontrolleri ---

    // Zamanlayıcıyı başlat/duraklat
    startBtn.addEventListener('click', () => {
        if (isRunning) {
            // Duraklat
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.textContent = 'START';
        } else {
            // Başlat/Devam Et
            isRunning = true;
            startBtn.textContent = 'PAUSE'; // Görselde PAUSE yok ama iyi bir özellik
            timerInterval = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.textContent = 'START';
                    // Süre dolduğunda bir sonraki moda geçiş veya bildirim eklenebilir
                    alert('Süre Doldu!');
                    // Otomatik olarak bir sonraki moda geçiş mantığı (örnek)
                    if (currentMode === 'pomodoro') {
                        setMode('short-break');
                    } else {
                        setMode('pomodoro'); // Mola sonrası tekrar pomodoro'ya dön
                    }
                    return;
                }
                totalSeconds--;
                updateTimerDisplay();
            }, 1000);
        }
    });

    // Zamanlayıcıyı sıfırla
    resetBtn.addEventListener('click', () => {
        setMode(currentMode); // Mevcut modu yeniden yükleyerek sıfırla
    });

    // Mod butonları olay dinleyicileri
    pomodoroBtn.addEventListener('click', () => setMode('pomodoro'));
    shortBreakBtn.addEventListener('click', () => setMode('short-break'));
    longBreakBtn.addEventListener('click', () => setMode('long-break'));

    // --- Görev Yönetimi ---

    // Görev listesini kontrol et ve "No tasks yet" mesajını göster/gizle
    function checkTaskListVisibility() {
        if (taskList.children.length === 0) {
            noTasksMessage.style.display = 'block';
        } else {
            noTasksMessage.style.display = 'none';
        }
    }

    // Yeni görev ekle
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText === '') {
            alert('Lütfen bir görev girin!');
            return;
        }

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${taskText}</span>
            <button class="delete-task-btn">X</button>
        `;
        taskList.appendChild(listItem);
        newTaskInput.value = ''; // Input'u temizle
        currentCharCount.textContent = '0'; // Karakter sayacını sıfırla
        checkTaskListVisibility(); // Liste görünürlüğünü güncelle
    });

    // Görev silme (event delegation kullanarak)
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-task-btn')) {
            event.target.closest('li').remove();
            checkTaskListVisibility(); // Liste görünürlüğünü güncelle
        }
    });

    // Karakter sayacını güncelle
    newTaskInput.addEventListener('input', () => {
        currentCharCount.textContent = newTaskInput.value.length;
    });

    // Enter tuşuna basıldığında görev ekleme
    newTaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click(); // Add butonuna tıklama olayını tetikle
        }
    });


    // --- Başlangıç Durumu ---
    setMode('pomodoro'); // Uygulama yüklendiğinde Pomodoro modunu ayarla
    checkTaskListVisibility(); // Başlangıçta görev listesini kontrol et
});