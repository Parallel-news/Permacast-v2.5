interface loadingProps {
  className?: string;
  // accepts numbers or strings like "10px"
  height?: number | string;
};

const Loading = ({ className = "w-full rounded-3xl mt-2", height = "100px" }: loadingProps) => (
  <div
    style={{ height: typeof height === "number" ? `${height}px` : height }}
    className={`${className} animate-pulse bg-gray-300/30`}
  />
);

export default Loading;