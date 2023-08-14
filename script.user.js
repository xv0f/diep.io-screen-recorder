// ==UserScript==
// @name         Diep.io Screen Recorder
// @namespace    https://github.com/xv0f/
// @version      1.0.0
// @description  Lightweight screen recorder that records the canvas in diep.io. Press "z" to toggle or change the settings at the very top of the script.
// @author       xv0f
// @match        *://diep.io/*
// @icon         https://diep.io/898d2001b20a8386a610.png
// @grant        none
// ==/UserScript==

const SETTINGS = {
  toggle: "z",
  fps: 30
}

!(async () => {
  while (!document.getElementById("canvas")) await new Promise(res => setTimeout(res, 100));

  let toggle = false,
    recorder = null,
    chunks = [];

  document.addEventListener("keydown", ({ key }) => {
    if (key == SETTINGS.toggle) {
      toggle = !toggle;

      if (toggle) {
        recorder = new MediaRecorder(
          document.getElementById("canvas").captureStream(SETTINGS.fps),
          { mimeType: "video/webm; codecs=vp9" }
        );

        recorder.ondataavailable = ({ data }) => chunks.push(data);

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          const element = document.createElement("a");

          element.download = "diep.io-recording.webm";
          element.href = url;

          element.click();
        }

        recorder.start();
      } else {
        recorder.stop();
        recorder = null;
        chunks = [];
      }
    }
  });
})();
