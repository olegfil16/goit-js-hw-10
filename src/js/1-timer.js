// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('button[data-start]');
const day = document.querySelector('span[data-days]');
const hour = document.querySelector('span[data-hours]');
const minute = document.querySelector('span[data-minutes]');
const second = document.querySelector('span[data-seconds]');

let userSelectedDate = '';

btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    if (options.defaultDate >= selectedDates[0]) {
      btnStart.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      userSelectedDate = selectedDates[0];
      btnStart.disabled = false;
    }
  },
};

flatpickr(input, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, 0);
}

btnStart.addEventListener('click', onClickBtnStart);

function onClickBtnStart(event) {
  btnStart.disabled = true;
  input.disabled = true;

  const intervalId = setInterval(() => {
    const dateNow = new Date();
    const deltaTime = userSelectedDate - dateNow;

    const { days, hours, minutes, seconds } = convertMs(deltaTime);

    day.innerHTML = addLeadingZero(days);
    hour.innerHTML = addLeadingZero(hours);
    minute.innerHTML = addLeadingZero(minutes);
    second.innerHTML = addLeadingZero(seconds);

    const timerFinished = [days, hours, minutes, seconds].every(
      value => value === 0
    );

    if (timerFinished) {
      clearInterval(intervalId);
      input.disabled = false;
    }
  }, 1000);
}
