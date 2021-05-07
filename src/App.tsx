import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";

const emptyGrid = new Array(5).fill(new Array(5).fill(0));

const colorPalette = ["red", "yellow", "green", "blue", "purple"];

function resetGrid(method: string) {
  if (method === "rainbow")
    return [...emptyGrid.map((x, i) => [...x.map(() => i)])];
  return [...emptyGrid.map((x, i) => [...x.map(() => 0)])];
}

function App() {
  const [grid, setGrid] = useState(() => resetGrid("all same"));

  const [paletteText, setPaletteText] = useState("");

  const [ourColorPalette, setColorPalette] = useState(colorPalette);

  const [collapsed, setCollapsed] = useState(false);

  const set = (z: number, r: number, set: number) => {
    setGrid([
      ...grid.map((x, i) => [
        ...x.map((a, j) => (i === z && r === j ? set : a)),
      ]),
    ]);
  };

  const parsePalette = (palette: string) => {
    try {
      setColorPalette(
        palette.split("\n").map((x) => "#" + x.split("#")[1].slice(0, 6))
      );
    } catch (error) {}
  };

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const timerRef = useRef<number | null>(null);

  const transitionWait = 500;

  return (
    <div className="App">
      {grid.map((a, i: any) => (
        <div>
          {a.map((b: any, j: any) => (
            <div
              className={timerRef.current ? "running" : "not-running"}
              onClick={() => set(i, j, (b + 1) % ourColorPalette.length)}
              style={{
                background: ourColorPalette[b % ourColorPalette.length],
              }}
            ></div>
          ))}
        </div>
      ))}
      <div>
        <button
          style={{ padding: 10 }}
          onClick={() => setCollapsed(!collapsed)}
        >
          |||
        </button>
      </div>
      <div
        className="options"
        style={{ visibility: collapsed ? "collapse" : "visible" }}
      >
        {timerRef.current === null && (
          <button
            onClick={() => {
              timerRef.current = window.setInterval(() => {
                setGrid([
                  ...gridRef.current.map((x, i) => [...x.map((a, j) => a + 1)]),
                ]);
              }, transitionWait);
            }}
          >
            START
          </button>
        )}
        {timerRef.current !== null && (
          <button
            onClick={() => {
              clearInterval(timerRef.current || 0);
              timerRef.current = null;
            }}
          >
            STOP
          </button>
        )}
        {ourColorPalette.map((i, x) => (
          <input
            onChange={(e) => {
              setColorPalette(
                ourColorPalette.map((r, j) =>
                  j === x ? `${e.currentTarget.value}` : r
                )
              );
            }}
            value={i}
            type="color"
          ></input>
        ))}
        <textarea
          value={paletteText}
          onChange={(e) => setPaletteText(e.currentTarget.value)}
        ></textarea>
        <button onClick={() => parsePalette(paletteText)}>PARSE</button>
      </div>
    </div>
  );
}

export default App;
