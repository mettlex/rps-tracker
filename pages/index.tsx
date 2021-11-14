import type { NextPage } from "next";
import Head from "next/head";
import { createRef, useState } from "react";
import Arrow from "../components/Arrow";
import { getMultinomialDistribution } from "../utils/probability";

const containerRef = createRef<HTMLDivElement>();

const Home: NextPage = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [pVisible, setPVisible] = useState<boolean>(false);

  let pNextB = "";
  let pNextT = "";
  let pNextR = "";

  if (pVisible) {
    pNextB = (
      getMultinomialDistribution({
        n: boxes.length + 1,
        xB: boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length + 1,
        xT: boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length,
        xR: boxes.filter((box) => box.name.trim().toLowerCase() === "red").length,
        pB:
          boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length /
          (boxes.length + 1),
        pT:
          boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length /
          (boxes.length + 1),
        pR:
          boxes.filter((box) => box.name.trim().toLowerCase() === "red").length /
          (boxes.length + 1),
      }) * 100
    ).toFixed(2);

    pNextT = (
      getMultinomialDistribution({
        n: boxes.length + 1,
        xB: boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length,
        xT: boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length + 1,
        xR: boxes.filter((box) => box.name.trim().toLowerCase() === "red").length,
        pB:
          boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length /
          (boxes.length + 1),
        pT:
          boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length /
          (boxes.length + 1),
        pR:
          boxes.filter((box) => box.name.trim().toLowerCase() === "red").length /
          (boxes.length + 1),
      }) * 100
    ).toFixed(2);

    pNextR = (
      getMultinomialDistribution({
        n: boxes.length + 1,
        xB: boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length,
        xT: boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length,
        xR: boxes.filter((box) => box.name.trim().toLowerCase() === "red").length + 1,
        pB:
          boxes.filter((box) => box.name.trim().toLowerCase() === "blue").length /
          (boxes.length + 1),
        pT:
          boxes.filter((box) => box.name.trim().toLowerCase() === "tie").length /
          (boxes.length + 1),
        pR:
          boxes.filter((box) => box.name.trim().toLowerCase() === "red").length /
          (boxes.length + 1),
      }) * 100
    ).toFixed(2);
  }

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
        <h4
          className="title"
          onClick={() => {
            setPVisible(!pVisible);
          }}
        >
          RPS Tracker
        </h4>

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
              {pVisible && <div className="p-next">{pNextB}</div>}
            </div>
            <div
              className="box tie"
              onClick={() => {
                handleBoxClick("Tie");
              }}
            >
              Tie
              {pVisible && <div className="p-next">{pNextT}</div>}
            </div>
            <div
              className="box red"
              onClick={() => {
                handleBoxClick("Red");
              }}
            >
              Red
              {pVisible && <div className="p-next">{pNextR}</div>}
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
