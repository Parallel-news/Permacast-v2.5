import { FC } from "react";


const LoadingSkeleton: FC = () => (
  <div>
    <div className="flex items-center justify-between mb-20">
      <div className="flex items-center">
        <div className="bg-gray-300/30 animate-pulse h-[120px] w-[120px] rounded-full px-12 mx-8"></div>
        <div className="bg-gray-300/30 animate-pulse rounded-full w-40 h-12 "></div>
      </div>
      <div className="w-80 h-12 rounded-full animate-pulse bg-gray-300/30"></div>
    </div>
    <div className="w-full h-16 rounded-full animate-pulse bg-gray-300/30 mt-8"></div>
    <div className="w-full h-16 rounded-full animate-pulse bg-gray-300/30 mt-8"></div>
  </div>
);

export default function Loading() {
  return <LoadingSkeleton />;
}
