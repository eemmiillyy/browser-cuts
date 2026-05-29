
declare const chrome: any;

(() => {
  'use strict';


  type Preset = {
    width: string;
    height: string;
    top: string;
    right: string;
    left: string;
    box: {
      clipPath: string;
    }
  }

  type Shape = "square" | "circle" | "triangle" | "triangleHorizontal";

  const presetForShape = (shape: Shape): Preset => {
    switch (shape) {
      case "square":
        return {
          width: "420px",
          height: "420px",
          top: "500px",
          right: "16px",
          left: "auto",
          box: {
            clipPath: "polygon(0% 20%, 97% 0%, 100% 98%, 3% 100%)",
          }
        }
      case "triangle":  
      return {
        width: "200px",
        height: "1220px",
        top: "0px",
        right: "380px",
        left: "auto",
        box: {
          clipPath: "polygon(42% 0%, 58% 0%, 50% 150%)",
        }
      }
      case "triangleHorizontal":  
      return {
        width: "1700px",
        height: "1220px",
        top: "0px",
        right: "700px",
        left: "auto",
        box: {
          clipPath: "polygon(0% 38%, 0% 62%, 150% 50%)",
        }
      }
      default: "circle"
        return {
          width: "420px",
          height: "420px",
          right: "auto",
          top: "16px",
          left: "16px",
          box: {
            clipPath: "circle(50% at 50% 50%)",
          }
        }
    }
  }

  
  const displayContent = (data: string) => {
    const ID = "__square_overlay__";
    const existing = document.getElementById(ID);
    if (existing) { existing.remove(); return; }
  
    const host = document.createElement("div");
    host.id = ID;
  
    const styleHost = (shape: Shape) => {
      const preset = presetForShape(shape);
      host.style.position = "fixed";
      host.style.top = preset.top;
      host.style.right = preset.right;
      host.style.left = preset.left;
      host.style.zIndex = "2147483647";
      host.style.width = preset.width;
      host.style.height = preset.height;
      host.style.pointerEvents = "none";
    }

    const randomShape = selectRandomShape() as Shape;
    styleHost(randomShape);
  
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        .box {
          width: 100%;
          height: 100%;
          background: black;
          display: flex;
          flex-direction: column;
          pointer-events: auto;
          overflow: hidden;
        }
        pre {
          flex: 1;
          margin: 0;
          padding: 10px 12px;
          overflow: auto;
          white-space: wrap;
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
    if (!box) return;
    
    const preset = presetForShape(randomShape);
    console.log("Selected shape:", randomShape, "with preset:", preset);
    // Apply shape to box based on shape
    if (preset.box.clipPath) box.style.clipPath = preset.box.clipPath;

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
    const shapes: Shape[] = ['square', 'circle', 'triangle', 'triangleHorizontal'];
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

