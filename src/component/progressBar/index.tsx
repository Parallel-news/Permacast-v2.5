interface ProgressObject {
  parentClassName?: string;
  progressBarClassName?: string;
  progress: string;
  colorHex: string;
};

const defaultProgressParentStyling = `w-full bg-zinc-800 rounded-full `;
const defaultProgressBarStyling = `text-xs font-semibold text-black text-center p-1 leading-none rounded-full transition-width duration-500 h-[20px] flex items-center justify-center `;

export const ProgressBar = ({
  progress,
  colorHex,
  parentClassName = defaultProgressParentStyling,
  progressBarClassName = defaultProgressBarStyling,
}: ProgressObject) => {
  return (
    <div className={parentClassName}>
      <div className={`bg-[${colorHex}] ${progressBarClassName} `} style={{ backgroundColor: colorHex, width: `${progress === "0" ? "3" : progress}%` }}> {`${progress === "0" ? "" : progress + "%"}`}</div>
    </div>
  )
}