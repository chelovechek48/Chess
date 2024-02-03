import '@/styles/style';
import './slider';

const runningLineList = document.querySelectorAll('.running-line');

runningLineList.forEach((runningLine) => {
  runningLine.innerHTML += runningLine.innerHTML;
});
