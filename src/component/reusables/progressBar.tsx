import { Progress, Grid } from "@nextui-org/react";
import { css } from "@stitches/react";

const progressClass = css({
    height: "10px",
    backgroundColor: "inherit",
    borderRadius: "10px",
    overflow: "hidden",
    padding: "8px",
    "& div": {
      height: "100%",
      borderRadius: "10px",
      backgroundColor: "#FFFF00", // Change this to the color you want
    },
  })();

interface ProgressBarInter {
    value: number;
}

export default function ProgressBar(props: ProgressBarInter) {
  return (
        <Grid className="w-full h-[50px]">
            <Progress color="primary" size="xl" value={props.value} className={progressClass} css={{ backgroundColor: "#27272A" }} />
        </Grid>
  );
}
