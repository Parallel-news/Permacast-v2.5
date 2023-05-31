import axios from "axios";
import { EverpayTxAPIResponse } from "../../interfaces/everpay";

const checkPayment = async (tx: string, amount: string) => {
  const everpayURL = "https://api.everpay.io/tx/";
  const url = everpayURL + tx;

  // example url:
  // https://api.everpay.io/tx/0x8fac6c0c2c1c50e029a75ff0df2bcb8b643e279f1c218f9c2074f2c28f65b8ac

  const res: EverpayTxAPIResponse = (await axios.get(url)).data;
  const { status, amount: paidAmount, from, to } = res;
  if (status === "confirmed" && paidAmount >= amount) {
    return true;
  } else return false;
};

export default checkPayment;
