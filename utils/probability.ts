import { factorial } from "mathjs";

const defaultN = 0;
const defaultXB = 0;
const defaultXT = 0;
const defaultXR = 0;
const defaultPB = defaultXB / defaultN;
const defaultPT = defaultXT / defaultN;
const defaultPR = defaultXR / defaultN;

interface GetDistributionParams {
  n: number;
  xB: number;
  xT: number;
  xR: number;
  pB: number;
  pT: number;
  pR: number;
}

export const getMultinomialDistribution = (
  { n, xB, xT, xR, pB, pT, pR }: GetDistributionParams = {
    n: defaultN,
    xB: defaultXB,
    xT: defaultXT,
    xR: defaultXR,
    pB: defaultPB,
    pT: defaultPT,
    pR: defaultPR,
  },
) => {
  return (
    (factorial(n) / (factorial(xB) * factorial(xT) * factorial(xR))) *
    Math.pow(pB, xB) *
    Math.pow(pT, xT) *
    Math.pow(pR, xR)
  );
};
