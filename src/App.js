import React from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faUndoAlt,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const second = 1000;
const minute = 60000;

const buttonMap = [
  {
    class: "btn",
    id: "session-increment",
    value: "S+",
    display: <FontAwesomeIcon icon={faPlus} size="lg" />,
  },
  {
    class: "btn",
    id: "session-decrement",
    value: "S-",
    display: <FontAwesomeIcon icon={faMinus} size="lg" />,
  },
  {
    class: "btn",
    id: "break-increment",
    value: "B+",
    display: <FontAwesomeIcon icon={faPlus} size="lg" />,
  },
  {
    class: "btn",
    id: "break-decrement",
    value: "B-",
    display: <FontAwesomeIcon icon={faMinus} size="lg" />,
  },
  {
    class: "btn",
    id: "start_stop",
    value: "StopGo",
    display: <FontAwesomeIcon icon={faPlay} size="lg" />,
    icon: <FontAwesomeIcon icon={faPause} size="lg" />,
  },
  {
    class: "btn",
    id: "reset",
    icon: "",
    value: "Reset",
    display: <FontAwesomeIcon icon={faUndoAlt} size="lg" />,
  },
];

function convertInputToMsecs(inputTime) {
  let msecs = Math.floor(inputTime * minute);
  return msecs;
}

function dateToTime(input) {
  let msecs = input;
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
    this.handleSessionBreaks = this.handleSessionBreaks.bind(this);
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
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
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

  timerHandling() {
    if (this.state.clockRunning) {
      this.setState({
        counter: convertDateToTime(
          this.state.leftToCount,
          this.state.startDate,
          this.state.clockDate
        ),
      });
    }
  }

  displayHandling() {
    this.setState({
      displayArr: dateToTime(this.state.counter),
    });
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
        let sessionTime = this.state.sessionPeriod + change;
        if (
          this.state.clockRunning === false &&
          sessionTime <= 60 &&
          sessionTime > 0
        ) {
          this.setState(
            {
              sessionPeriod: sessionTime,
            },
            () => {
              this.setState({
                sessionLengthMs: convertInputToMsecs(this.state.sessionPeriod),
              });
              if (this.state.sessionNotBreak) {
                this.setState({
                  leftToCount: convertInputToMsecs(this.state.sessionPeriod),
                  counter: convertInputToMsecs(this.state.sessionPeriod),
                });
              }
            }
          );
        }
        break;
      case "break":
        let breakTime = this.state.breakPeriod + change;
        if (
          this.state.clockRunning === false &&
          breakTime <= 60 &&
          breakTime > 0
        ) {
          this.setState(
            {
              breakPeriod: breakTime,
            },
            () => {
              this.setState({
                breakLengthMs: convertInputToMsecs(this.state.breakPeriod),
              });
              if (!this.state.sessionNotBreak) {
                this.setState({
                  leftToCount: convertInputToMsecs(this.state.breakPeriod),
                  counter: convertInputToMsecs(this.state.breakPeriod),
                });
              }
            }
          );
        }
        break;
      case "stopgo":
        this.setState((prevState) => ({
          clockRunning: !prevState.clockRunning,
          leftToCount: this.state.counter,
          startDate: new Date(),
        }));
        break;
      case "reset":
        this.resetTimer();
        break;
      default:
        console.log("bad stateAddress");
    }
  }

  handleSessionBreaks() {
    if (this.state.counter === 0 && this.state.clockRunning) {
      if (this.state.sessionNotBreak) {
        this.setState({
          startDate: new Date(),
          leftToCount: this.state.breakLengthMs + 1000,
        });
        console.log("break");
      } else if (!this.state.sessionNotBreak) {
        this.setState({
          startDate: new Date(),
          leftToCount: this.state.sessionLengthMs + 1000,
        });
        console.log("work");
      }
      this.setState((prevState) => ({
        sessionNotBreak: !prevState.sessionNotBreak,
      }));
      const audio = document.getElementById("beep");
      audio.currentTime = 0;
      audio.play();
    }
  }

  render() {
    return (
      <div className="App">
        <h1 id="app-title">Work/Break Timer</h1>
        <div className="clock">
          <TimerDisplay
            timingArr={this.state.displayArr}
            breakTime={this.state.sessionNotBreak}
          />
          <div className="Control">
            <Button btnInfo={buttonMap[4]} passHandler={this.clickRouter} />
            <Button btnInfo={buttonMap[5]} passHandler={this.clickRouter} />
          </div>
        </div>
        <div className="Session">
          <h3 id="session-label">Set Working Time</h3>
          <div className="control-wrapper">
            <Button btnInfo={buttonMap[1]} passHandler={this.clickRouter} />
            <p className="numberDisplay" id="session-length">
              {this.state.sessionPeriod}
            </p>
            <Button btnInfo={buttonMap[0]} passHandler={this.clickRouter} />
          </div>
        </div>
        <div className="Break">
          <h3 id="break-label">Set Break Time</h3>
          <div className="control-wrapper">
            <Button btnInfo={buttonMap[3]} passHandler={this.clickRouter} />
            <p className="numberDisplay" id="break-length">
              {this.state.breakPeriod}
            </p>
            <Button btnInfo={buttonMap[2]} passHandler={this.clickRouter} />
          </div>
        </div>
        <audio
          id="beep"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          preload="auto"
        />
        <div className="chat">
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
        </div>
      </div>
    );
  }
}

function TimerDisplay(props) {
  let minLeadZero = "";
  let secLeadZero = "";
  let displayBreaks = [
    ["Work", "work-color"],
    ["Break", "break-color"],
  ];
  let lastMinute = "numberDisplay";
  let i = 0;
  if (props.timingArr[1] < 10) {
    secLeadZero = "0";
  }
  if (props.timingArr[0] < 10) {
    minLeadZero = "0";
  }
  if (!props.breakTime) {
    i = 1;
  }
  if (props.timingArr[0] === 0) {
    lastMinute = "numberDisplay goRed";
  }
  return (
    <div className="Timer">
      <h2 id="timer-label">
        Session -{" "}
        <span className={displayBreaks[i][1]}>{displayBreaks[i][0]}</span>
      </h2>
      <div className={lastMinute} id="time-left">
        {minLeadZero}
        {props.timingArr[0]}:{secLeadZero}
        {props.timingArr[1]}
      </div>
    </div>
  );
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    this.props.passHandler(e.currentTarget.value);
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
        {btnArr.icon}
      </button>
    );
  }
}

export default App;
