
declare const chrome: any;

(() => {
  'use strict';

  
  const displayContent = (data: string) => {
    const ID = "__square_overlay__";
    const existing = document.getElementById(ID);
    if (existing) { existing.remove(); return; }
  
    // Host attached to <html> for stability
    const host = document.createElement("div");
    host.id = ID;
  
    // Important: only the box captures events, not the whole viewport
    host.style.position = "fixed";
    host.style.top = "16px";
    host.style.right = "16px";
    host.style.zIndex = "2147483647";
    host.style.pointerEvents = "auto"; // capture inside
    // Do NOT set width/height on host if you only want the box region clickable.
    // Keep host sized to the box itself.
  
    document.documentElement.appendChild(host);
  
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
  
        .box {
          width: 420px;
          height: 420px;
          background: black;
          display: flex;
          flex-direction: column;
          pointer-events: auto; /* ensure it captures */
          overflow: hidden;
        }
  
        pre {
          flex: 1;
          margin: 0;
          padding: 10px 12px;
          overflow: auto;
          white-space: pre;
          word-break: break-word;
          font: 12px/1.35 ui-monospace, monospace;
          color: #fff;
          overflow: hidden;
        }
      </style>
  
      <div class="box" id="box">
        <pre id="content"></pre>
      </div>
    `;
  
    shadow.getElementById("content")!.textContent = document.documentElement.outerHTML;
  
    // Block events ONLY when they happen inside the box
    const box = shadow.getElementById("box");
    const block = (e: Event) => {
      e.stopPropagation();
      // preventDefault stops page scroll on wheel, etc.
      if (e.type === "wheel" || e.type === "contextmenu") e.preventDefault();
    };
  
    ["wheel", "mousedown", "mouseup", "click", "dblclick", "contextmenu"].forEach((t) => {
      box?.addEventListener(t, block, { capture: true, passive: false });
    });
  }

  const selectRandomShape = () => {
    const shapes: string[] = ['square'];
    const randomIndex = Math.floor(Math.random() * shapes.length)
    return shapes[randomIndex];
  }

  function init() {
    const tabUrl = window.location.href;
    if (!tabUrl) {
      console.error('No tab URL found');
      return;
    }
    const data = document.documentElement.outerHTML
    displayContent(data);
  }

  init();
})();

