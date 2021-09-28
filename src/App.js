import React from "react";
import "./App.css";

const sessionPeriod = 25;
const breakPeriod = 5;
const second = 1000;
const minute = 60000;

function convertInputToMsecs(inputTime) {
  let msecs = Math.floor(inputTime * minute);
  return msecs;
}

function dateToTime(msecs) {
  let mins = Math.floor(msecs / minute);
  let secs = Math.floor((msecs % minute) / second);
  let timeArr = [mins, secs];
  return timeArr;
}

function convertDateToTime(delta, startTime, currentTime) {
  let start = Date.parse(startTime);
  let current = Date.parse(currentTime);
  let toGo = delta + start - current;
  return toGo;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      startDate: new Date(),
      counter: 0,
      displayArr: [],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick();
      this.timerHandling();
      this.displayHandling();
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({ date: new Date() });
  }

  timerHandling() {
    this.setState({
      counter: convertDateToTime(
        convertInputToMsecs(sessionPeriod),
        this.state.startDate,
        this.state.date
      ),
    });
  }

  displayHandling() {
    this.setState({
      displayArr: dateToTime(this.state.counter),
    });
  }

  render() {
    return (
      <div className="App">
        <h1 id="app-title">Work/Break Timer</h1>
        <div className="Session">
          <h2 id="session-label">Session Length</h2>
          <button id="session-increment">Session Increment</button>
          <button id="session-decrement">Session Decrement</button>
          <p id="session-length">25</p>
        </div>
        <div className="Break">
          <h2 id="break-label">Break Length</h2>
          <button id="break-increment">Break Increment</button>
          <button id="break-decrement">Break Decrement</button>
          <p id="break-length">5</p>
        </div>
        <div className="Timer">
          <h2 id="timer-label">Timer</h2>
          <div id="time-left">
            {this.state.displayArr[0]}:{this.state.displayArr[1]}
          </div>
        </div>
        <div className="Control">
          <button id="start_stop">Start/Stop</button>
          <button id="reset">Reset</button>
        </div>
        <p>
          For the principles behind this work pattern see{" "}
          <a
            href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            target="_blank"
          >
            Pomodoro Technique
          </a>{" "}
          on Wikipedia
        </p>
        <p>Built by Jonathan Hodge</p>
      </div>
    );
  }
}

export default App;
