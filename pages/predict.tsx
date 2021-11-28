import type { NextPage } from "next";
import Head from "next/head";
import { createRef, useEffect, useMemo, useState } from "react";
import Arrow from "../components/Arrow";

const containerRef = createRef<HTMLDivElement>();

const Predict: NextPage = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [pVisible, setPVisible] = useState<boolean>(false);
  const [consideredObservations, setConsideredObservations] = useState<number>(15);
  const [hightLightedIndex, setHightLightedIndex] = useState<number | null>(null);
  const [prevHightLightedIndex, setPrevHightLightedIndex] = useState<number | null>(null);
  const [notPredicted, setNotPredicted] = useState<string>("");

  let bPoints = 0;
  let tPoints = 0;
  let rPoints = 0;

  const basePoints = 10;

  const latestObservations: string[] = boxes
    .slice(-consideredObservations) // last 15 or so
    .map((box) => box.name.trim().toLowerCase());

  const count = latestObservations.length;

  const last = latestObservations[count - 1]?.trim().toLowerCase();
  const secondLast = latestObservations[count - 2]?.trim().toLowerCase();
  const thirdLast = latestObservations[count - 3]?.trim().toLowerCase();

  //#region Rule #1
  // Same things wining thrice may not occur thrice

  if (
    count > 7 &&
    last &&
    secondLast &&
    thirdLast &&
    last === secondLast &&
    secondLast !== thirdLast
  ) {
    const last2Removed = latestObservations.slice(0, -2);
    const count = last2Removed.length;

    // now last 3 must be same
    if (
      last2Removed[count - 1] === last2Removed[count - 2] &&
      last2Removed[count - 2] === last2Removed[count - 3]
    ) {
      const last5Removed = last2Removed.slice(0, -3);
      const count = last5Removed.length;

      // now last 3 must be same again
      if (
        last5Removed[count - 1] === last5Removed[count - 2] &&
        last5Removed[count - 2] === last5Removed[count - 3]
      ) {
        if (last === "blue") {
          tPoints += basePoints * 3;
          rPoints += basePoints * 3;
        } else if (last === "tie") {
          bPoints += basePoints * 3;
          rPoints += basePoints * 3;
        } else if (last === "red") {
          tPoints += basePoints * 3;
          bPoints += basePoints * 3;
        }
      }
    }
  }

  //#endregion

  //#region Rule #2
  // Same things wining twice may not occur 4 times

  if (count > 8 && last && secondLast && thirdLast && last !== secondLast) {
    const last1Removed = latestObservations.slice(0, -1);
    const count = last1Removed.length;

    let condition = true;

    // now last 2 must be same 3 times

    let last2Removed = last1Removed;
    let last2RemovedCount = count;

    for (let i = 0; i < 3; i++) {
      if (last2Removed[last2RemovedCount - 1] === last2Removed[last2RemovedCount - 2]) {
        last2Removed = last2Removed.slice(0, -2);
        last2RemovedCount = last2Removed.length;
      } else {
        condition = false;
        break;
      }
    }

    if (condition === true) {
      if (last === "blue") {
        tPoints += basePoints * 2;
        rPoints += basePoints * 2;
      } else if (last === "tie") {
        bPoints += basePoints * 2;
        rPoints += basePoints * 2;
      } else if (last === "red") {
        tPoints += basePoints * 2;
        bPoints += basePoints * 2;
      }
    }
  }

  //#endregion

  //#region Rule #3
  // Same wining sequence may not be more than 4 in length

  const hightLightedIndexes: number[] = useMemo(
    () => (hightLightedIndex ? [hightLightedIndex] : []),
    [hightLightedIndex],
  );

  useEffect(() => {
    if (count > 6) {
      const last3Removed = latestObservations.slice(0, -3);

      const sequence = latestObservations.slice(-3);

      const matchedIndex = last3Removed.findIndex((_, i) => {
        return (
          last3Removed[i] === sequence[0] &&
          last3Removed[i + 1] === sequence[1] &&
          last3Removed[i + 2] === sequence[2]
        );
      });

      const matched = matchedIndex !== -1 && last3Removed[matchedIndex];

      if (sequence[0] === sequence[1] && sequence[1] !== sequence[2] && matched) {
        const index = boxes.length - latestObservations.length + matchedIndex + 3;

        if (prevHightLightedIndex !== hightLightedIndex || !hightLightedIndex) {
          setHightLightedIndex(index);
          setNotPredicted(boxes[index]?.name.toLowerCase());
        }
      }

      if (!matched) {
        setPrevHightLightedIndex(null);
        setHightLightedIndex(null);
        setNotPredicted("");
      }
    }
  }, [
    boxes,
    boxes.length,
    count,
    hightLightedIndex,
    hightLightedIndexes,
    last,
    latestObservations,
    prevHightLightedIndex,
    secondLast,
    notPredicted,
  ]);

  //#endregion

  //#region
  // Check double occurences

  let starMarkedIndexes: number[] = [];

  for (let i = 2; i < boxes.length; i++) {
    if (!boxes[i + 1]?.name || !boxes[i]?.name || !boxes[i - 1]?.name || !boxes[i - 2]?.name) {
      continue;
    }

    if (
      boxes[i].name !== boxes[i + 1].name &&
      boxes[i - 1].name === boxes[i - 2].name &&
      boxes[i].name !== boxes[i - 1].name
    ) {
      starMarkedIndexes.push(i + 1);
    }
  }

  //#endregion

  //#region
  // Check missing

  const checkedCountForMissing = 6;

  let missing = "";

  let teams = ["blue", "tie", "red"];

  const lastOnes = boxes.slice(-checkedCountForMissing).map((box) => box.name.trim().toLowerCase());

  if (lastOnes.length >= checkedCountForMissing) {
    for (let i = 0; i < checkedCountForMissing; i++) {
      if (teams.length === 0) {
        break;
      }

      const found = lastOnes.find((x) => teams.includes(x));

      if (found) {
        teams = teams.filter((x) => x !== found);
      }
    }

    if (teams.length === 1) {
      missing = teams[0];
    }
  }

  //#endregion

  const handleBoxClick = (name: string = "Tie") => {
    setBoxes([
      ...boxes,
      {
        name,
      },
    ]);

    if (hightLightedIndex) {
      setPrevHightLightedIndex(hightLightedIndex);
      setHightLightedIndex(hightLightedIndex + 1);
      setNotPredicted(boxes[hightLightedIndex + 1].name.toLowerCase());
    }

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
            if (!pVisible) {
              let observations = 0;

              const answer = prompt("How many previous wins to observe?");

              if (!answer) {
                return;
              }

              try {
                observations = parseInt(answer);
              } catch (error) {
                return;
              }

              if (isNaN(observations) || observations < 1) {
                return;
              }

              setConsideredObservations(observations);
            }

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

                if (hightLightedIndex) {
                  setPrevHightLightedIndex(hightLightedIndex - 2);
                  setHightLightedIndex(hightLightedIndex - 1);

                  setNotPredicted(boxes[hightLightedIndex - 1]?.name.toLowerCase());
                }
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

                setPrevHightLightedIndex(null);
                setHightLightedIndex(null);
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
                <div
                  className={`box ${box.name.toLowerCase()}`}
                  style={
                    hightLightedIndexes.includes(i) && pVisible
                      ? { outline: "2px solid black", fontWeight: "bold" }
                      : {}
                  }
                >
                  {starMarkedIndexes.includes(i) && "*"}
                  {box.name}
                  {starMarkedIndexes.includes(i) && "*"}
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
              Blue {missing === "blue" && <sub>(missing)</sub>}
              {pVisible && <div className="p-next">{bPoints}</div>}
            </div>
            <div
              className="box tie"
              onClick={() => {
                handleBoxClick("Tie");
              }}
            >
              Tie {missing === "tie" && <sub>(missing)</sub>}
              {pVisible && <div className="p-next">{tPoints}</div>}
            </div>
            <div
              className="box red"
              onClick={() => {
                handleBoxClick("Red");
              }}
            >
              Red {missing === "red" && <sub>(missing)</sub>}
              {pVisible && <div className="p-next">{rPoints}</div>}
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

export default Predict;
