
import { SPINNER_COLOR } from "@/constants/index";
import { Icon } from "../icon";
import Spinner from "./spinner";

interface RssSubmitButtonInter {
  isSubmitting: boolean;
  color: string;
  dimensions: string; //h-10 w-10
  onClick?: () => void;
};

export default function RssSubmit(props: RssSubmitButtonInter) {
  return (
    <button
      style={{ color: "#27272a" }}
      className={`rounded-full flexFullCenter ${props.color} ${props.dimensions}`}
      onClick={props.onClick}
    >
      {props.isSubmitting ?
        <Spinner className="spinner-yellow w-6 h-6 text-black" />
        :
        <Icon className={"w-6 h-6 text-zinc-800"} icon="ARROWSMALLRIGHT" />
      }
    </button>
  )
}