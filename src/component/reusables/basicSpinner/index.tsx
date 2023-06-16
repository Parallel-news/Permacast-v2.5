import { SPINNER_COLOR } from "@/constants/index";
import { PermaSpinner } from "../PermaSpinner";

export const BasicLoaderSpinner = () => (
  <PermaSpinner
    spinnerColor={SPINNER_COLOR}
    size={10}
    divClass={`w-full flexCenter `}
  />
);
