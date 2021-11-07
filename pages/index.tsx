import type { NextPage } from "next";
import Head from "next/head";
import { createRef, useState } from "react";
import Arrow from "../components/Arrow";

const containerRef = createRef<HTMLDivElement>();

const Home: NextPage = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);

  const handleBoxClick = (name: string = "Tie") => {
    setBoxes([
      ...boxes,
      {
        name,
      },
    ]);

    const tid = setTimeout(() => {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      clearTimeout(tid);
    }, 200);
  };

  return (
    <div>
      <Head>
        <title>Rock, Paper, Scissors Tracker / RPS Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h4 className="title">RPS Tracker</h4>

        <footer className="footer">
          <div>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                boxes.pop();
                setBoxes([...boxes]);
              }}
            >
              Undo&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
            <a href="https://github.com/mettlex/rps-tracker">
              &nbsp;| Open-sourced by Mettle X |&nbsp;
            </a>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setBoxes([]);
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear
            </a>
          </div>
        </footer>

        <div className="container" ref={containerRef}>
          {boxes.map((box, i) => {
            let count = 1;

            for (let j = boxes.length - 1; j >= 0; j--) {
              if (box.name === boxes[j - 1]?.name && boxes[j].name === box.name) {
                count++;
              } else {
                break;
              }
            }

            return (
              <div className="output" key={i}>
                <div className={`box ${box.name.toLowerCase()}`}>
                  {box.name}
                  {count > 1 && i === boxes.length - 1 && <sub>({count})</sub>}
                </div>
                {i !== boxes.length - 1 && <Arrow type={box.name.toLowerCase()}></Arrow>}
              </div>
            );
          })}

          <div className="inputs">
            <div
              className="box blue"
              onClick={() => {
                handleBoxClick("Blue");
              }}
            >
              Blue
            </div>
            <div
              className="box tie"
              onClick={() => {
                handleBoxClick("Tie");
              }}
            >
              Tie
            </div>
            <div
              className="box red"
              onClick={() => {
                handleBoxClick("Red");
              }}
            >
              Red
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface Box {
  name: string;
}

export default Home;
