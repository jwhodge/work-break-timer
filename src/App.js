import React from "react";
import "./App.css";

const second = 1000;
const minute = 60000;

/* the major issue is setting the timer to count right and not be influenced by start date 
ideas - update the start date on start/stop click
      - create a variable to hold the current state of the counter and use that to calc time remain
      - replace sessionPeriod with better variable se above*/

const buttonMap = [
  {
    class: "btn",
    id: "session-increment",
    icon: "",
    value: "S+",
    display: "Session Increment",
  },
  {
    class: "btn",
    id: "session-decrement",
    icon: "",
    value: "S-",
    display: "Session Decrement",
  },
  {
    class: "btn",
    id: "break-increment",
    icon: "",
    value: "B+",
    display: "Break Increment",
  },
  {
    class: "btn",
    id: "break-decrement",
    icon: "",
    value: "B-",
    display: "Break Decrement",
  },
  {
    class: "btn",
    id: "start_stop",
    icon: "",
    value: "StopGo",
    display: "Start/Stop",
  },
  {
    class: "btn",
    id: "reset",
    icon: "",
    value: "Reset",
    display: "Reset",
  },
];

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

/* function convertTimeToDate(ms) {
  let dateObj = new Date(ms);
  return dateObj;
}

function countSeconds(startTime, currentTime) {
  let start = Date.parse(startTime);
  let current = Date.parse(currentTime);
  let secsPassed = current - start;
  return secsPassed;
} */

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionPeriod: 25,
      sessionLengthMs: 1500000,
      breakPeriod: 5,
      breakLengthMs: 300000,
      clockDate: new Date(),
      startDate: new Date(),
      /* counters */
      counter: 1500000,
      leftToCount: 0,
      /* clock toggles */
      clockRunning: false,
      sessionNotBreak: true,
      /* display */
      displayArr: [25, 0],
    };
    this.resetTimer = this.resetTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.displayHandling = this.displayHandling.bind(this);
    this.timerHandling = this.timerHandling.bind(this);
    this.clickRouter = this.clickRouter.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateStartDate = this.updateStartDate.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick();
      this.timerHandling();
      this.displayHandling();
      this.handleSessionBreaks();
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  resetTimer() {
    this.setState(() => {
      return {
        sessionPeriod: 25,
        sessionLengthMs: 1500000,
        breakPeriod: 5,
        breakLengthMs: 300000,
        clockDate: new Date(),
        startDate: new Date(),
        /* counters */
        counter: 1500000,
        leftToCount: 0,
        /* clock toggles */
        clockRunning: false,
        sessionNotBreak: true,
        /* display */
        displayArr: [25, 0],
      };
    });
  }

  tick() {
    if (this.state.clockRunning) {
      this.setState({ clockDate: new Date() });
    }
  }

  displayHandling() {
    this.setState({
      displayArr: dateToTime(this.state.counter),
    });
  }

  updateStartDate() {
    this.setState({
      startDate: new Date(),
    });
  }

  updateLeftToCount() {
    this.setState({
      leftToCount: this.state.counter,
    });
  }

  timerHandling() {
    if (this.state.clockRunning) {
      if (this.state.sessionNotBreak) {
        this.setState({
          counter: convertDateToTime(
            this.state.leftToCount,
            this.state.startDate,
            this.state.clockDate
          ),
        });
      } else {
        this.setState({
          counter: convertDateToTime(
            this.state.leftToCount,
            this.state.startDate,
            this.state.clockDate
          ),
        });
      }
    }
  }

  clickRouter(switchCase) {
    console.log("router input", switchCase);
    let stateAddress = "";
    let change = 0;
    /* this switch dictates which state to change by what value */
    switch (switchCase) {
      case "S+":
        change = 1;
        stateAddress = "session";
        break;
      case "S-":
        change = -1;
        stateAddress = "session";
        break;
      case "B+":
        change = 1;
        stateAddress = "break";
        break;
      case "B-":
        change = -1;
        stateAddress = "break";
        break;
      case "StopGo":
        change = 0;
        stateAddress = "stopgo";
        break;
      case "Reset":
        stateAddress = "reset";
        break;
      default:
        console.log("incorrect input click router");
    }
    console.log("state", stateAddress, "change", change);
    /* this switch selects the correct state and updates it */
    switch (stateAddress) {
      case "session":
        if (!this.state.clockRunning) {
          this.setState(
            {
              sessionPeriod: this.state.sessionPeriod + change,
            },
            () => {
              this.setState({
                sessionLengthMs: convertInputToMsecs(this.state.sessionPeriod),
                leftToCount: convertInputToMsecs(this.state.sessionPeriod),
                counter: convertInputToMsecs(this.state.sessionPeriod),
              });
            }
          );
        }
        break;
      case "break":
        if (!this.state.clockRunning) {
          this.setState(
            {
              breakPeriod: this.state.breakPeriod + change,
            },
            () => {
              this.setState({
                breakLengthMs: convertInputToMsecs(this.state.breakPeriod),
                leftToCount: convertInputToMsecs(this.state.breakPeriod),
                counter: convertInputToMsecs(this.state.breakPeriod),
              });
            }
          );
        }
        break;
      case "stopgo":
        this.setState((prevState) => ({
          clockRunning: !prevState.clockRunning,
        }));
        this.updateStartDate();
        this.updateLeftToCount();
        break;
      case "reset":
        this.resetTimer();
        break;
      default:
        console.log("bad stateAddress");
    }
  }

  handleSessionBreaks() {
    if (this.state.counter === 0) {
      this.setState((prevState) => ({
        sessionNotBreak: !prevState.sessionNotBreak,
      }));
    }
  }

  render() {
    return (
      <div className="App">
        <h1 id="app-title">Work/Break Timer</h1>
        <div className="Session">
          <h2 id="session-label">Session Length</h2>
          <Button btnInfo={buttonMap[0]} passHandler={this.clickRouter} />
          <Button btnInfo={buttonMap[1]} passHandler={this.clickRouter} />
          <p id="session-length">{this.state.sessionPeriod}</p>
        </div>
        <div className="Break">
          <h2 id="break-label">Break Length</h2>
          <Button btnInfo={buttonMap[2]} passHandler={this.clickRouter} />
          <Button btnInfo={buttonMap[3]} passHandler={this.clickRouter} />
          <p id="break-length">{this.state.breakPeriod}</p>
        </div>
        <div className="Timer">
          <h2 id="timer-label">Timer</h2>
          <div id="time-left">
            {this.state.displayArr[0]}:{this.state.displayArr[1]}
          </div>
        </div>
        <div className="Control">
          <Button btnInfo={buttonMap[4]} passHandler={this.clickRouter} />
          <Button btnInfo={buttonMap[5]} passHandler={this.clickRouter} />
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

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    this.props.passHandler(e.target.value);
  }

  render() {
    const btnArr = this.props.btnInfo;
    return (
      <button
        className={btnArr.class}
        id={btnArr.id}
        value={btnArr.value}
        onClick={this.handleClick}
      >
        {btnArr.display}
      </button>
    );
  }
}

export default App;
