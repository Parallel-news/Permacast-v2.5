import { arweaveTX } from "../../interfaces";

export const validateArweaveTX = (tx: arweaveTX) => (
  tx.length === 43 && /^([a-zA-Z0-9_-]){43}$/.test(tx)
);
