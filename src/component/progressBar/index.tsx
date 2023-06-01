type ProgressObject = {
    progress: string;
    colorHex: string;
}
export const ProgressBar = ({progress, colorHex}: ProgressObject) => {
    return (
        <div className="w-full bg-gray-500 rounded-full dark:bg-gray-700">
            <div className={`bg-[${colorHex}]text-xs font-semibold text-black text-center p-1 leading-none rounded-full transition-width duration-500 h-[20px] flex items-center justify-center`} style={{backgroundColor: colorHex, width: `${progress === "0" ? "3" : progress}%`}}> {`${progress === "0" ? "" : progress+"%"}`}</div>
        </div>
    )
}