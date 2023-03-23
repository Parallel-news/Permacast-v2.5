import { FC } from "react";
import { Classname, RGBorRGBAstring } from "../../interfaces/ui";

interface CooyubInterface {
  svgStyle: Classname;
  rectStyle: Classname;
  fill: Classname;
};

export const Cooyub: FC<CooyubInterface> = ({ svgStyle, rectStyle, fill }) => {
  return (
    <svg className={svgStyle} style={{borderRadius: '4px'}}>
      <rect className={rectStyle} xmlns="http://www.w3.org/2000/svg" fill={fill}/>
    </svg>
  );
};
