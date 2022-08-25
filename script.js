const min = document.getElementById('minutes');
const sec = document.getElementById('seconds');

let interval;

const timer = {
    pomodoro: 25,
    long: 15,
    short: 5,
    sessions: 0,
    longBreakInterval: 3,
};

const getRemainingTime = (endTime) => {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
}

const startTimer = () => {
    let {total} = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;
    
    startButton.dataset.action = 'stop';
    startButton.textContent = 'STOP';
    startButton.classList.add('active');

    interval = setInterval(() => {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();
        if (timer.remainingTime.total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.session % timer.longBreakInterval === 0) {
                        switchMode('long');
                    } else {
                        switchMode('short');
                    }
                    break;
                    default: 
                        switchMode('pomodoro');
            }
            startTimer()
        }
    }, 1000)
}

const updateClock = () => {
    const {remainingTime} = timer;
    console.log(remainingTime)
    const minutes = `${remainingTime.minutes}`.padStart(2, 0);
    const seconds = `${remainingTime.seconds}`.padStart(2, 0);

    min.textContent = minutes;
    sec.textContent = seconds;
}

const switchMode = (mode) => {
    console.log(timer.mode)
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    }
    
    document 
    .querySelectorAll('button[data-mode]')
    .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    updateClock();
}

const handleMode = (e) => {
    const {mode} = e.target.dataset;
    if (!mode) return;
    switchMode(mode);
    stopTimer()
}

const stopTimer = () => {
    clearInterval(interval);

    startButton.dataset.action = 'start';
    startButton.textContent = 'START';
    startButton.classList.remove('active')
}

const startButton = document.querySelector('.start-button')
const modeButtons = document.querySelector('.button-container')
modeButtons.addEventListener('click', handleMode)
startButton.addEventListener('click', () => {
    const {action} = startButton.dataset;
    console.log(action);
    (action === 'start') ? startTimer() : stopTimer();
})

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});
