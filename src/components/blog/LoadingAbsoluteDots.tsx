"use client";

const LoadingAbsoluteDots = () => {
    return (
        <div className="absolute top-0 left-0 right-0 z-1 flex justify-center items-center m-2">
            <span className="w-24 h-24 loading loading-dots text-blue-400" />
        </div>
    );
};

export default LoadingAbsoluteDots;