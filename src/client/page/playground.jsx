import React, { Component } from "react";
// import "../../../public/css/playground.css";

class Playground_Page extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const displays = document.querySelectorAll(".note-display");
    const transitionDuration = 900;

    displays.forEach((display) => {
      let note = parseFloat(display.dataset.note);
      let [int, dec] = display.dataset.note.split(".");
      [int, dec] = [Number(int), Number(dec)];

      strokeTransition(display, note);

      increaseNumber(display, int, "int");
      increaseNumber(display, dec, "dec");
    });

    function strokeTransition(display, note) {
      let progress = display.querySelector(".circle__progress--fill");
      let radius = progress.r.baseVal.value;
      let circumference = 2 * Math.PI * radius;
      let offset = (circumference * (10 - note)) / 10;

      progress.style.setProperty("--initialStroke", circumference);
      progress.style.setProperty(
        "--transitionDuration",
        `${transitionDuration}ms`
      );

      setTimeout(() => (progress.style.strokeDashoffset = offset), 100);
    }

    function increaseNumber(display, number, className) {
      let element = display.querySelector(`.percent__${className}`),
        decPoint = className === "int" ? "." : "",
        interval = transitionDuration / number,
        counter = 0;

      let increaseInterval = setInterval(() => {
        if (counter === number) {
          window.clearInterval(increaseInterval);
        }

        element.textContent = counter + decPoint;
        counter++;
      }, interval);
    }
  }

  render() {
    return (
      <div>
        <ul class="display-container">
          <li class="note-display" data-note="7.50">
            <div class="circle">
              <svg width="84" height="84" class="circle__svg">
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--path"
                ></circle>
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--fill"
                ></circle>
              </svg>

              <div class="percent">
                <span class="percent__int">0.</span>
                <span class="percent__dec">00</span>
              </div>
            </div>

            <span class="label">Transparent</span>
          </li>

          <li class="note-display" data-note="9.27">
            <div class="circle">
              <svg width="84" height="84" class="circle__svg">
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--path"
                ></circle>
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--fill"
                ></circle>
              </svg>

              <div class="percent">
                <span class="percent__int">0.</span>
                <span class="percent__dec">00</span>
              </div>
            </div>

            <span class="label">Reasonable</span>
          </li>

          <li class="note-display" data-note="6.93">
            <div class="circle">
              <svg width="84" height="84" class="circle__svg">
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--path"
                ></circle>
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--fill"
                ></circle>
              </svg>

              <div class="percent">
                <span class="percent__int">0.</span>
                <span class="percent__dec">00</span>
              </div>
            </div>

            <span class="label">Usable</span>
          </li>

          <li class="note-display" data-note="8.72">
            <div class="circle">
              <svg width="84" height="84" class="circle__svg">
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--path"
                ></circle>
                <circle
                  cx="41"
                  cy="41"
                  r="38"
                  class="circle__progress circle__progress--fill"
                ></circle>
              </svg>

              <div class="percent">
                <span class="percent__int">0.</span>
                <span class="percent__dec">00</span>
              </div>
            </div>

            <span class="label">Exemplary</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default Playground_Page;
