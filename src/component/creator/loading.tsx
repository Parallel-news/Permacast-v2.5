export default function Loading() {
    
    const loadingBox = "rounded-lg animate-pulse bg-zinc-700 w-[80%] h-[140px]"
    const loadingCircle = "h-[140px] w-[140px] rounded-full animate-pulse bg-zinc-700"
    const loadingContainer = "w-full flex flex-col space-y-4 space-x-0 justify-center items-center md:justify-between md:space-y-0 md:flex-row md:space-x-10"

    return (
        <div className={loadingContainer}>
            <div className={loadingCircle}>
            </div>
            <div className={loadingBox}>
            </div>
        </div>
    )
}