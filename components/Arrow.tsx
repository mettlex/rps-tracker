import React from "react";

interface Props {
  type?: string;
}

const Arrow: React.FC<Props> = ({ type }) => {
  return (
    <span
      className={`arrow is-triangle arrow-bar is-right ${
        type === "blue"
          ? "blue-arrow"
          : type === "red"
          ? "red-arrow"
          : type === "tie"
          ? "green-arrow"
          : ""
      }`}
    ></span>
  );
};

export default Arrow;
