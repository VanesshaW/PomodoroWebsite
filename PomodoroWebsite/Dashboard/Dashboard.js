document.addEventListener('DOMContentLoaded', function() {
    function savePreferences() {
        const focusTime = document.getElementById('focus-time').value;
        const shortBreak = document.getElementById('short-break').value;
        const longBreak = document.getElementById('long-break').value;
        const autoSequence = document.getElementById('AutoSeqCheck').checked;
        const timerMode = document.querySelector('.mode-dropdown').value;

        const formData = new FormData();
        formData.append('focusTime', focusTime);
        formData.append('shortBreak', shortBreak);
        formData.append('longBreak', longBreak);
        formData.append('autoSequence', autoSequence);
        formData.append('timerMode', timerMode);

        fetch('save_preferences.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Preferences saved successfully');
            } else {
                console.error('Error saving preferences:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Add event listeners to save preferences when changed
    const focusTimeInput = document.getElementById('focus-time');
    const shortBreakInput = document.getElementById('short-break');
    const longBreakInput = document.getElementById('long-break');
    const autoSequenceCheck = document.getElementById('AutoSeqCheck');
    const timerModeDropdown = document.querySelector('.mode-dropdown');

    if (focusTimeInput) focusTimeInput.addEventListener('change', savePreferences);
    if (shortBreakInput) shortBreakInput.addEventListener('change', savePreferences);
    if (longBreakInput) longBreakInput.addEventListener('change', savePreferences);
    if (autoSequenceCheck) autoSequenceCheck.addEventListener('change', savePreferences);
    if (timerModeDropdown) timerModeDropdown.addEventListener('change', savePreferences);

});
document.addEventListener('DOMContentLoaded', function() {
    const pipButton = document.getElementById('popupbtn');
    const timerContainer = document.querySelector('.container');
    let pipWindow = null;

    // Function to dynamically add a script tag
    function loadExternalScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    pipButton.addEventListener('click', togglePiP);
    async function togglePiP() {
        if (!pipWindow) {
            try {
                await loadExternalScript('Dashboard.js');

                pipWindow = await documentPictureInPicture.requestWindow({
                    width: 320,
                    height: 240
                });

                
                const pipContent = document.createElement('div');
                pipContent.className = 'pip-content';
                
                
                const timerArea = document.createElement('div');
                timerArea.className = 'timer-area';
                const timerText = document.querySelector('.timer-area p:not([style*="display: none"])').cloneNode(true);
                timerArea.appendChild(timerText);
                pipContent.appendChild(timerArea);

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'timer-settings';
                ['start', 'pause', 'continue', 'reset'].forEach(buttonId => {
                    const button = document.createElement('button');
                    button.id = `pip-${buttonId}-button`;
                    button.textContent = buttonId.charAt(0).toUpperCase() + buttonId.slice(1);
                    button.style.display = document.getElementById(`${buttonId}-button`).style.display;
                    button.addEventListener('click', () => document.getElementById(`${buttonId}-button`).click());
                    buttonContainer.appendChild(button);
                });
                pipContent.appendChild(buttonContainer);

                pipWindow.document.body.appendChild(pipContent);

                // Copy styles
                const styles = Array.from(document.styleSheets)
                    .filter(sheet => !sheet.href || sheet.href.startsWith(window.location.origin))
                    .map(sheet => {
                        try {
                            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
                        } catch (e) {
                            console.warn('Cannot access stylesheet', e);
                            return '';
                        }
                    })
                    .join('\n');


                const pipStyles = `
                    body {
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                    }
                    .pip-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                    }
                    .timer-area {
                        font-size: 20vw;
                        margin-bottom: 2vh;
                        margin-top:0;
                    }
                    .timer-settings {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 1vh;
                    }
                    .timer-settings button {
                        font-size: 8vw;
                        padding: 1vh 2vw;
                        margin: 0.7vh;
                        background-color: rgba(126, 89, 250, 0.3);
                        color: white;
                        border: 1px solid #FFFFFF;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .timer-settings button:hover {
                        // background-color: #7E59FA !important;
                        background-image: linear-gradient(#7E59FA, #c759fa);
                    }
                `;

                const styleElement = document.createElement('style');
                styleElement.textContent = styles + pipStyles;
                pipWindow.document.head.appendChild(styleElement);

                
                function updatePiP() {
                    const mainTimer = document.querySelector('.timer-area p:not([style*="display: none"])');
                    const pipTimer = pipWindow.document.querySelector('.timer-area p');
                    if (mainTimer && pipTimer) {
                        pipTimer.textContent = mainTimer.textContent;
                    }

                    ['start', 'pause', 'continue', 'reset'].forEach(buttonId => {
                        const mainButton = document.getElementById(`${buttonId}-button`);
                        const pipButton = pipWindow.document.getElementById(`pip-${buttonId}-button`);
                        if (mainButton && pipButton) {
                            pipButton.style.display = mainButton.style.display;
                        }
                    });
                }

                
                const observer = new MutationObserver(updatePiP);
                observer.observe(document.querySelector('.container'), {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });

                updatePiP();

                const resizeObserver = new ResizeObserver(() => {
                    updatePiP();
                });
                resizeObserver.observe(pipWindow.document.body);

                pipWindow.addEventListener('unload', () => {
                    pipWindow = null;
                    observer.disconnect();
                    resizeObserver.disconnect();
                });

            } catch (error) {
                console.error('Failed to enter Picture-in-Picture mode:', error);
            }
        } else {
            pipWindow.close();
            pipWindow = null;
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const workTimer = document.getElementById('work-timer');
    const shortTimer = document.getElementById('short-timer');
    const longTimer = document.getElementById('long-timer');
    const notificationSound = document.getElementById('notification-sound'); // AUDIO

    const timerOptionBtns = document.querySelectorAll('.timer-option button');
    const timerSettingsBtns = document.querySelectorAll('.timer-settings button');

    let intervalId;
    let isRunning = false;
    let currentTimer = "work";
    let minutes, seconds;

    let currentMode = 'pomodoro';

    // auto sequence
    let isAutoSequence = false;
    let workSessionsCompleted = 0;
    var AutoCheckbox = document.getElementById('AutoSeqCheck');

    function handleAutoSequenceToggle() {
        isAutoSequence = document.querySelector('.auto-sequence input[type="checkbox"]').checked;
        console.log("Auto Sequence:", isAutoSequence);
    }

    document.getElementById('focus-time').addEventListener('input', handleInputChange);
    document.getElementById('short-break').addEventListener('input', handleInputChange);
    document.getElementById('long-break').addEventListener('input', handleInputChange);
    document.querySelector('.auto-sequence input[type="checkbox"]').addEventListener('change', handleAutoSequenceToggle);

    function handleInputChange(event) {
        const inputId = event.target.id;
        const inputValue = parseInt(event.target.value) || 0;
    
        if (inputId === 'focus-time' && currentTimer === 'work') {
            updateTimer(inputValue);
        } else if (inputId === 'short-break' && currentTimer === 'short') {
            updateTimer(inputValue);
        } else if (inputId === 'long-break' && currentTimer === 'long') {
            updateTimer(inputValue);
        }
    }

    function updateTimer(newMinutes) {
        stopTimer(); 
        minutes = newMinutes;
        seconds = 0;
        updateTimerDisplay();
        resetButtonStates();
    
    }

    function getUserInput() {
        const workInput = document.getElementById('focus-time').value;
        const shortInput = document.getElementById('short-break').value;
        const longInput = document.getElementById('long-break').value;

        return {
            work: parseInt(workInput) || 25, // Default to 25 if input is invalid
            short: parseInt(shortInput) || 5, // Default to 5 if input is invalid
            long: parseInt(longInput) || 15  // Default to 15 if input is invalid
        }
    }

    function updateTimerOnInput() {
        const userInput = getUserInput();
        if (currentTimer === "work") {
            minutes = userInput.work;
        } else if (currentTimer === "short") {
            minutes = userInput.short;
        } else {
            minutes = userInput.long;
        }
        seconds = 0;
        updateTimerDisplay();

        PostStatsToDB();
    }
    
    function updateTitle(timerContent) {
        if (currentMode !== 'stopwatch') { // Check if the current mode is not stopwatch
            if (isRunning) {
                document.title = `${timerContent} - Pomodoro Timer`;
            } else {
                document.title = "Pomodoro Timer";
            }
        }
    }
    

    function updateTimerDisplay() {
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        const timerContent = `${formattedMinutes}:${formattedSeconds}`;
    
        // console.log("Updating timer display:", currentTimer, timerContent);
    
        if (currentTimer === "work") {
            // console.log("Before update:", workTimer.textContent);
            workTimer.textContent = timerContent;
            // console.log("After update:", workTimer.textContent);
        } else if (currentTimer === "short") {
            shortTimer.textContent = timerContent;
        } else {
            longTimer.textContent = timerContent;
        }
    
        updateTitle(timerContent);
    }
    
    function setTimerDefaults() {
        updateTimerOnInput();
    }

    let StatsSecondsCounter = 0; //ngitung seconds

    function startTimer() {
        if (isRunning) {
            stopTimer(); // Stop the current timer if it's running
        }
    
        isRunning = true;
        updateTitle(`${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`);
    
        intervalId = setInterval(function () {

            if(currentTimer=='work'){
                StatsSecondsCounter++; //Ngitung stats hanya waktu timer work
            }

            if (seconds > 0) {
                seconds--;
            } else {
                if (minutes === 0) {
                    clearInterval(intervalId);
                    isRunning = false;
                    playNotificationSound(); // AUDIO PLAY
                    if (minutes === 0 && seconds === 0) {
                        clearInterval(intervalId);
                        isRunning = false;
                        playNotificationSound(); // AUDIO PLAY
                        switchTimer();
                        updateTimerDisplay();
                    }
                } else {
                    seconds = 59;
                    minutes--;
                }
            }
    
            updateTimerDisplay();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(intervalId);
        isRunning = false;
        updateTitle();
    }

    function resetTimer() {
        workSessionsCompleted = 0;
        stopTimer();
        setTimerDefaults();
        updateTimerDisplay();
        resetButtonStates();
    }

    function PostStatsToDB(){                                                           //POST STATS TO DB
        const sessionDuration = Math.floor(StatsSecondsCounter / 60);

        const xhr = new XMLHttpRequest();
            xhr.open('POST', 'RecordSession.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                    } else {
                        console.error('Error:', xhr.statusText);
                    }
                }
            };
            xhr.send(`session_duration=${StatsSecondsCounter}`);

        StatsSecondsCounter = 0;
    }


    function resetButtonStates() {
        document.getElementById('start-button').style.display = "";
        document.getElementById('reset-button').style.display = "none";
        document.getElementById('pause-button').style.display = "none";
        document.getElementById('continue-button').style.display = "none";
    }

    function resetTimerDisplayAndButtons() {
        resetTimer(); 
        updateTimerDisplay();
        resetButtonStates(); 
    }

    function switchTimer() {
        const userInput = getUserInput();
        
        if (AutoCheckbox.checked) {
            
            if (currentTimer === "work") {
                workSessionsCompleted++;
                if (workSessionsCompleted % 4 === 0) {
                    currentTimer = "long";
                    minutes = userInput.long;
                    console.log("Done with focus, switching to long break");
                } else {
                    currentTimer = "short";
                    minutes = userInput.short;
                    console.log("Done with focus, switching to short break");
                }
            } else {
                currentTimer = "work";
                minutes = userInput.work;
                console.log("Done with break, switching to focus");
            }
        } else {resetTimerDisplayAndButtons();}
        
        seconds = 0;
        updateTimerDisplay();
        
        
        // Hide all timers
        workTimer.style.display = 'none';
        shortTimer.style.display = 'none';
        longTimer.style.display = 'none';
        
        // Show the current timer
    if (currentTimer === "work") {
        workTimer.style.display = 'block';
        document.getElementById('work-button').classList.add('selected');
        document.getElementById('short-button').classList.remove('selected');
        document.getElementById('long-button').classList.remove('selected');
    } else if (currentTimer === "short") {
        shortTimer.style.display = 'block';
        document.getElementById('work-button').classList.remove('selected');
        document.getElementById('short-button').classList.add('selected');
        document.getElementById('long-button').classList.remove('selected');
    } else {
        longTimer.style.display = 'block';
        document.getElementById('work-button').classList.remove('selected');
        document.getElementById('short-button').classList.remove('selected');
        document.getElementById('long-button').classList.add('selected');
    }
        
        if (isAutoSequence) {
            startTimer();
            updateTimerOnInput();
            updateTimerDisplay();
        }
    }
    
    function switchTimerNew() {
        PostStatsToDB();
    // Cycle through the timers
    if (currentTimer === "work") {
        currentTimer = "work";
    } else if (currentTimer === "short") {
        currentTimer = "short";
    } else {
        currentTimer = "long";
    }

    updateTimerOnInput();
    resetButtonStates();

    // Hide all timers
    workTimer.style.display = 'none';
    shortTimer.style.display = 'none';
    longTimer.style.display = 'none';

    // Show the current timer
    if (currentTimer === "work") {
        workTimer.style.display = 'block';
    } else if (currentTimer === "short") {
        shortTimer.style.display = 'block';
    } else {
        longTimer.style.display = 'block';
    }
}


    function handlePomodoroButtonClick() {
        if (this.id === "start-button") {
            document.getElementById('start-button').style.display = "none";
            document.getElementById('reset-button').style.display = "";
            document.getElementById('pause-button').style.display = "";
            startTimer();
        } else if (this.id === "pause-button") {
            document.getElementById('continue-button').style.display = "";
            document.getElementById('pause-button').style.display = "none";
            stopTimer();
        } else if (this.id === "continue-button") {
            document.getElementById('pause-button').style.display = "";
            document.getElementById('continue-button').style.display = "none";
            startTimer();
        } else if (this.id === "reset-button") {
            document.getElementById('start-button').style.display = "";
            document.getElementById('reset-button').style.display = "none";
            document.getElementById('pause-button').style.display = "none";
            document.getElementById('continue-button').style.display = "none";
            resetTimer();
            PostStatsToDB();
        }
    }

    function playNotificationSound() { // AUDIO NOTIFICATION
        notificationSound.play();
    }

    timerOptionBtns.forEach(button => {
        button.addEventListener('click', () => {
            timerOptionBtns.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            if (button.id === "work-button") {
                currentTimer = "work";
            } else if (button.id === "short-button") {
                currentTimer = "short";
            } else {
                currentTimer = "long";
            }

            // updateTimerDisplay();
            switchTimerNew();
            resetTimer();
        });
    });

    timerSettingsBtns.forEach(button => {
        button.addEventListener('click', handlePomodoroButtonClick);
    });

    resetTimer();

    // Stopwatch functionality
    let stopwatchInterval;
    let stopwatchTime = 0;
    let stopwatchRunning = false;

    function updateStopwatchDisplay() {
        let hours = Math.floor(stopwatchTime / 3600);
        let minutes = Math.floor((stopwatchTime % 3600) / 60);
        let seconds = stopwatchTime % 60;

        document.getElementById('stopwatch-display').textContent = 
            (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }

    function startStopwatch() {
        if (!stopwatchRunning) {
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateStopwatchDisplay();
            }, 1000);
            stopwatchRunning = true;
            document.getElementById('start-button').style.display = 'none';
            document.getElementById('pause-button').style.display = 'inline-block';
            document.getElementById('reset-button').style.display = 'inline-block';
        }
    }

    function pauseStopwatch() {
        if (stopwatchRunning) {
            clearInterval(stopwatchInterval);
            stopwatchRunning = false;
            document.getElementById('pause-button').style.display = 'none';
            document.getElementById('continue-button').style.display = 'inline-block';
        }
    }

    function continueStopwatch() {
        startStopwatch();
        document.getElementById('continue-button').style.display = 'none';
        document.getElementById('pause-button').style.display = 'inline-block';
    }

    function resetStopwatch() {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchRunning = false;
        updateStopwatchDisplay();
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('pause-button').style.display = 'none';
        document.getElementById('continue-button').style.display = 'none';
        document.getElementById('reset-button').style.display = 'none';
    }

    function switchToStopwatch() {
        document.getElementById('pomodoro-timer').style.display = 'none';
        document.getElementById('stopwatch-timer').style.display = 'block';
        document.querySelector('.timer-option').style.display = 'none';
        resetTimer(); //resettimer
        PostStatsToDB();

        updateButtonsForStopwatch();
    }

    function switchToPomodoro() {
        document.getElementById('pomodoro-timer').style.display = 'block';
        document.getElementById('stopwatch-timer').style.display = 'none';
        document.querySelector('.timer-option').style.display = 'flex';
        resetStopwatch();
        updateButtonsForPomodoro();
    }

    function updateButtonsForStopwatch() {
        document.getElementById('start-button').onclick = startStopwatch;
        document.getElementById('pause-button').onclick = pauseStopwatch;
        document.getElementById('continue-button').onclick = continueStopwatch;
        document.getElementById('reset-button').onclick = resetStopwatch;
    }

    function updateButtonsForPomodoro() {
        timerSettingsBtns.forEach(button => {
            button.onclick = null;
            button.addEventListener('click', handlePomodoroButtonClick);
        });
    }

    // Add event listener to mode dropdown
    // Add event listener to mode dropdown
    document.querySelector('.mode-dropdown').addEventListener('change', function() {
    if (this.value === 'stopwatch') {
        currentMode = 'stopwatch'; // Update the current mode
        switchToStopwatch();
    } else {
        currentMode = 'pomodoro'; // Update the current mode
        switchToPomodoro();
    }
    });


    // Initialize with Pomodoro mode
    switchToPomodoro();



    window.addEventListener('beforeunload', function (event) {
        PostStatsToDB();
    });




});//''

function ChangeBackground(a){
    var background = document.getElementById('Background');
    
    var src = a;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "ChangeSessionBackground.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText); 
            background.style.backgroundImage = 'url(' + src + ')';
        }
    };
    xhr.send("BackgroundURL=" + encodeURIComponent(src));
}

function UseCustomPlaylist(){
    var playlistURL = document.getElementById('inputPlaylist').value.trim();

    var playlistID = playlistURL.split('/playlist/')[1]?.split('?')[0];

    if (!playlistID) {
        playlistID = '64HYvPPbaFZEl5HWFVrunM';
    }

    var spotify = document.getElementById('SpotifyPlaylistFrame');
    var embedURL = `https://open.spotify.com/embed/playlist/${playlistID}?utm_source=generator&theme=0`;

    document.getElementById('inputPlaylist').value = '';



    var xhr = new XMLHttpRequest();
            xhr.open("POST", "SessionPlaylist.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText); // Display the response from the PHP script
                    
                    spotify.src = embedURL;
                }
            };
            xhr.send("embedURL=" + encodeURIComponent(embedURL));
}

function OpenPopupPlaylist(){
    var popup = document.getElementById('PlaylistContainer');
    popup.classList.add('show');
}

function ClosePopupPlaylist(){
    var popup = document.getElementById('PlaylistContainer');
    popup.classList.remove('show');
}

function OpenMenu(){
    var Menu = document.getElementById('Menu');
    var Blur = document.getElementById('BackgroundBlur');
    var NoteId = document.getElementById('popupnoteid');

    NoteId.value='';

    Menu.style.display='flex';
    Blur.style.display='block';

    ChangeMenu('Themes');

    setTimeout(function() {
        Menu.classList.add('show');
        Blur.classList.add('show');
      }, 100); 
}

function OpenMenuFriends(){
    var Menu = document.getElementById('Menu');
    var Blur = document.getElementById('BackgroundBlur');
    var NoteId = document.getElementById('popupnoteid');

    NoteId.value='';

    Menu.style.display='flex';
    Blur.style.display='block';

    ChangeMenu('Friends');

    setTimeout(function() {
        Menu.classList.add('show');
        Blur.classList.add('show');
      }, 100); 
}

function CloseMenu(){
    var Menu = document.getElementById('Menu');
    var Blur = document.getElementById('BackgroundBlur');

    Menu.classList.remove('show');
    Blur.classList.remove('show');

    setTimeout(function() {
        Menu.style.display='none';
        Blur.style.display='none';
      }, 500); // 1000 milliseconds = 1 second
}

function CloseNotePopup(){
    var Blur = document.getElementById('NoteBackgroundBlur');
    var Popup = document.getElementById('PopupNote');
    var PopupNoteTitle = document.getElementById('PopupNoteTitle');
    var PopupNoteContent = document.getElementById('PopupNoteContent');
    var NoteId = document.getElementById('popupnoteid');
    var loader = document.getElementById('popupnoteloader');
    var saveButton = document.getElementById('NoteSaveButton');

    NoteId.value='';

    Blur.classList.add('hidden');
    Popup.classList.add('hidden');

    setTimeout(() => {
        PopupNoteContent.value = '';
        PopupNoteTitle.value = '';
        saveButton.style.display = 'block';
        loader.style.display = 'none';
    }, 1000); //Timeout supaya text hilang stelah transisi
}

function OpenNotePopup(){
    var Blur = document.getElementById('NoteBackgroundBlur');
    var Popup = document.getElementById('PopupNote');
    var loader = document.getElementById('popupnoteloader');
    var saveButton = document.getElementById('NoteSaveButton');
    var NoteId = document.getElementById('popupnoteid');

    NoteId.value='';

    saveButton.style.display = 'block';
    loader.style.display = 'none';

    Blur.classList.remove('hidden');
    Popup.classList.remove('hidden');
}

function ChangeMenu(a){
    var ButtonThemes = document.getElementById('Themes'); 
    var ButtonMode = document.getElementById('Mode');
    var ButtonStats = document.getElementById('Stats');
    var ButtonNotes = document.getElementById('Notes');
    var ButtonProfile = document.getElementById('Profile');
    var ButtonFriends = document.getElementById('Friends');

    var ThemesContent = document.getElementById('ThemesMenu');
    var ModeContent = document.getElementById('ModeMenu');
    var StatsContent = document.getElementById('StatsMenu');
    var NotesContent = document.getElementById('NotesMenu');
    var ProfileContent = document.getElementById('ProfileMenu');
    var FriendsContent = document.getElementById('FriendsMenu');

    ButtonThemes.classList.remove('selected');
    ButtonMode.classList.remove('selected');
    ButtonStats.classList.remove('selected');
    ButtonNotes.classList.remove('selected');
    ButtonProfile.classList.remove('selected');
    ButtonFriends.classList.remove('selected');

    ThemesContent.classList.add('hidden');
    ModeContent.classList.add('hidden');
    StatsContent.classList.add('hidden');
    NotesContent.classList.add('hidden');
    ProfileContent.classList.add('hidden');
    FriendsContent.classList.add('hidden');

    setTimeout(function() {
        ThemesContent.style.display='none';
        ModeContent.style.display='none';
        StatsContent.style.display='none';
        NotesContent.style.display='none';
        ProfileContent.style.display='none';
        FriendsContent.style.display='none';

        switch(a){
            case 'Themes': ThemesContent.style.display='flex'; break;
            case 'Mode': ModeContent.style.display='block'; break;
            case 'Stats': StatsContent.style.display='block'; break;
            case 'Notes': NotesContent.style.display='block'; break;
            case 'Profile': ProfileContent.style.display='block'; break;
            case 'Friends': FriendsContent.style.display='block'; break;
        }
        setTimeout(function() {
            document.getElementById(a).classList.add('selected');
            document.getElementById(a+'Menu').classList.remove('hidden');
         }, 100); 
      }, 100); 
}

function ChangeMenuNote(){
    var notelist = document.getElementById('NoteList');

    notelist.innerHTML = '<div class="loader note" id="noteloader"></div>';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'FetchNotesFromDB.php', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            notelist.innerHTML = xhr.responseText;
        }
    };
    xhr.send();

    ChangeMenu('Notes');
}

function ChangeMenuStats() {
    const statsMenu = document.getElementById('StatsMenu');
    
    if (!document.querySelector('.date-range-selector')) {
        const rangeSelector = document.createElement('div');
        rangeSelector.className = 'date-range-selector';
        rangeSelector.innerHTML = `
            <input type="radio" id="all" name="dateRange" value="all" checked>
            <label for="all">All Time</label>
            <input type="radio" id="7days" name="dateRange" value="7days">
            <label for="7days">Last 3 Days</label>
            <input type="radio" id="biweekly" name="dateRange" value="biweekly">
            <label for="biweekly">Bi-weekly</label>
            <input type="radio" id="monthly" name="dateRange" value="monthly">
            <label for="monthly">Monthly</label>
        `;
        statsMenu.insertBefore(rangeSelector, statsMenu.firstChild);
    }

    const radioButtons = document.querySelectorAll('input[name="dateRange"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', fetchAndUpdateChart);
    });

    fetchAndUpdateChart();
    ChangeMenu('Stats');
}

function ChangeMenuFriends(){
    OpenMenuFriends();
    ChangeMenu('Friends');
    OpenFriendList();
}

function fetchAndUpdateChart() {
    const selectedRange = document.querySelector('input[name="dateRange"]:checked').value;
    console.log('Fetching data for range:', selectedRange); // Debug log

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `GetStats.php?range=${selectedRange}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Received data:', xhr.responseText); // Debug log
                try {
                    const sessions = JSON.parse(xhr.responseText);
                    if (sessions.length > 0) {
                        createChart(sessions, selectedRange);
                    } else {
                        displayNoDataMessage();
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    displayErrorMessage('Error parsing data');
                }
            } else {
                console.error('Error:', xhr.statusText);
                displayErrorMessage('Error fetching data');
            }
        }
    };
    xhr.send();
}

function createChart(sessions, selectedRange) {
    const dates = sessions.map(session => new Date(session.date));
    const totalTimes = sessions.map(session => (session.session_duration / 60).toFixed(2));

    const ctx = document.getElementById('statsChart');

    // Destroy existing chart 
    if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
    }
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Total Focus Time (minutes)',
                data: totalTimes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'yyyy-MM-dd'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Focus Time (minutes)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Focus Time Statistics - ${selectedRange === 'all' ? 'All Time' : selectedRange}`
                }
            }
        }
    });
}

function displayNoDataMessage() {
    const ctx = document.getElementById('statsChart').getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillText('No data available for the selected range', 10, 50);
}

function displayErrorMessage(message) {
    const ctx = document.getElementById('statsChart').getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillText(message, 10, 50);
}
// Popup functionality
document.addEventListener('DOMContentLoaded', function() {
    const focusInput = document.querySelector('.focus-input');
    const popup = document.querySelector('.popup');
    const popupInputs = document.querySelectorAll('.checkbox-input');
    const popupSubmit = document.querySelector('.popup-submit');
    const checkboxes = document.querySelectorAll('.custom-checkbox input[type="checkbox"]');

    focusInput.addEventListener('click', function() {
        popup.classList.add('active');
        setTimeout(() => {
            popup.querySelector('.popup-content').style.display = 'flex';
            popup.querySelector('.popup-content').style.transform = 'translateY(0)';
            popup.querySelector('.popup-content').style.opacity = '1';
        }, 10);
    });

    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    popupSubmit.addEventListener('click', function() {
        let selectedFocusArea = '';
        
        for (let i = 0; i < checkboxes.length; i++) {
            if (!checkboxes[i].checked && popupInputs[i].value.trim() !== '') {
                selectedFocusArea = popupInputs[i].value.trim();
                break;
            }
        }
    
        focusInput.value = selectedFocusArea;
        closePopup();
    });

    function closePopup() {
        popup.querySelector('.popup-content').style.transform = 'translateY(100%)';
        popup.querySelector('.popup-content').style.opacity = '0';
        setTimeout(() => {
            popup.classList.remove('active');
        }, 300);
    }
});

function SaveNoteToDB(){
    var NoteTitle = document.getElementById('PopupNoteTitle').value;
    var NoteContent = document.getElementById('PopupNoteContent').value;
    var NoteId = document.getElementById('popupnoteid');
    var loader = document.getElementById('popupnoteloader');
    var saveButton = document.getElementById('NoteSaveButton');

    saveButton.style.display = 'none';
    loader.style.display = 'flex';
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "AddNotesToDB.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === "success") {
                console.log(response.message);
                NoteId.value='';
                eval(response.command);
            } else {
                NoteId.value='';
                alert(response.message);
            }
        }
    };


    var params = "title=" + encodeURIComponent(NoteTitle) + 
                "&content=" + encodeURIComponent(NoteContent) + 
                "&note_id=" + encodeURIComponent(NoteId.value);

    xhr.send(params);
    NoteId.value='';
}

function ViewNote(a){
    var popuptitle = document.getElementById('PopupNoteTitle');
    var popupcontent = document.getElementById('PopupNoteContent');
    var NoteId = document.getElementById('popupnoteid');

    popuptitle.value = document.getElementById('notetitle'+a).value;
    popupcontent.value = document.getElementById('notecontent'+a).value;

    CloseMenu();
    OpenNotePopup();

    NoteId.value = a;
}

function DeleteNote(a){

    var loader = document.getElementById('popupnoteloader'+a);
    var DeleteButton = document.getElementById('ButtonNoteDelete'+a);

    loader.style.display = 'flex';
    DeleteButton.style.display = 'none';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "DeleteNote.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.status === "success") {
                console.log(response.message);
                eval(response.command);
            } else {
                loader.style.display = 'none';
                DeleteButton.style.display = 'block';
                alert(response.message);
            }
        }
    };


    var param = "note_id=" + encodeURIComponent(a);

    xhr.send(param);
}

function checkShortLongBreak(){
    var longbreak = document.getElementById('long-break');
    var shortbreak = document.getElementById('short-break');

    if(parseInt(shortbreak.value) > parseInt(longbreak.value)){
        shortbreak.value = longbreak.value;
    }
}




function OpenAddFriendPopup(){
    CloseMenu();
    var Blur = document.getElementById('FriendsBackgroundBlur');
    var AddFriendPopup = document.getElementById('AddFriendPopup');

    Blur.classList.remove('hidden');
    AddFriendPopup.classList.remove('hidden');
}

function CloseAddFriendPopup(){
    var Blur = document.getElementById('FriendsBackgroundBlur');
    var AddFriendPopup = document.getElementById('AddFriendPopup');

    Blur.classList.add('hidden');
    AddFriendPopup.classList.add('hidden');

    OpenMenuFriends();
    ChangeMenu('Friends');
    OpenPending();
}

function sendFriendRequest(friend_id) {

    var AddButton = document.getElementById('AddFriendButton'+friend_id.toString());
    var Loading = document.getElementById('loaderAddfriend'+friend_id.toString());

    AddButton.style.display = 'none';
    Loading.style.display = 'flex';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "FriendsPhps/SendFriendRequest.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            CloseAddFriendPopup();
            alert(xhr.responseText);
        }
    };
    xhr.send("friend_id=" + friend_id);
}

function CancelRequest(friend_id){
    var xhr = new XMLHttpRequest();
            xhr.open("POST", "FriendsPhps/CancelOutgoingRequest.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    OpenPending();
                }
            };
            xhr.send("friend_id=" + friend_id);
}

function DeclineRequest(friend_id){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "FriendsPhps/DeclineFriendrequest.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            OpenRequests();
            alert(xhr.responseText);
        }
    };
    xhr.send("friend_id=" + friend_id);
}

function AcceptRequest(friend_id){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "FriendsPhps/AcceptFriendRequest.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            OpenFriendList();
            alert(xhr.responseText);
        }
    };
    xhr.send("friend_id=" + friend_id);
}

function RemoveFriend(friend_id){
    var xhr = new XMLHttpRequest();
            xhr.open("POST", "FriendsPhps/RemoveFriend.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    OpenFriendList();
                    alert(xhr.responseText);
                }
            };
            xhr.send("friend_id=" + friend_id);
}

function OpenFriendList(){
    var List = document.getElementById('FriendsContentContainer');
    var Pending = document.getElementById('Pending');
    var Requests = document.getElementById('Requests');
    var FriendList = document.getElementById('FriendList');

    Requests.classList.remove('selected');
    Pending.classList.remove('selected');
    FriendList.classList.remove('selected');

    FriendList.classList.add('selected');

    List.innerHTML='<div class="loader note" id="Friendloader"></div>';

    var Loader = document.getElementById('Friendloader');
    Loader.style.display='flex';

    var xhr = new XMLHttpRequest();
            xhr.open("GET", "FriendsPhps/FetchFriends.php", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    Loader.style.display='none';
                    List.innerHTML = xhr.responseText;
                }
            };
        xhr.send();

}

function OpenRequests(){
    var List = document.getElementById('FriendsContentContainer');
    var Pending = document.getElementById('Pending');
    var Requests = document.getElementById('Requests');
    var FriendList = document.getElementById('FriendList');

    Requests.classList.remove('selected');
    Pending.classList.remove('selected');
    FriendList.classList.remove('selected');

    Requests.classList.add('selected');

    List.innerHTML='<div class="loader note" id="Friendloader"></div>';
    var Loader = document.getElementById('Friendloader');
    Loader.style.display='flex';

    var List = document.getElementById('FriendsContentContainer');
    var xhr = new XMLHttpRequest();
            xhr.open("GET", "FriendsPhps/FetchIncomingRequest.php", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    Loader.style.display='none';
                    List.innerHTML = xhr.responseText;
                }
            };
    xhr.send();
    
}

function OpenPending(){
    var List = document.getElementById('FriendsContentContainer');
    var Pending = document.getElementById('Pending');
    var Requests = document.getElementById('Requests');
    var FriendList = document.getElementById('FriendList');

    Requests.classList.remove('selected');
    Pending.classList.remove('selected');
    FriendList.classList.remove('selected');

    Pending.classList.add('selected');

    List.innerHTML='<div class="loader note" id="Friendloader"></div>';
    var Loader = document.getElementById('Friendloader');
    Loader.style.display='flex';

    var List = document.getElementById('FriendsContentContainer');
    var xhr = new XMLHttpRequest();
            xhr.open("GET", "FriendsPhps/FetchOutgoingRequest.php", true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    Loader.style.display='none';
                    List.innerHTML = xhr.responseText;
                }
            };
    xhr.send();
}





document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('FriendSearch');
    const ResultList = document.getElementById('SearchResult');

    searchInput.addEventListener('input', function () {
        const query = searchInput.value;
        if (query.length > 0) {
            fetch(`FriendsPhps/SearchUsername.php?query=${query}`)
                .then(response => response.text())
                .then(data => {
                    ResultList.innerHTML = data;
                })
                .catch(error => console.error('Error:', error));
        } else {
            ResultList.innerHTML = '';
        }
    });
});