import React from "react";

function Box({ header, desc }: { header: string; desc: string }) {
  return (
    <div className=" border-black border-2  bg-[rgb(116,186,116)] rounded-3xl h-[400px] ">
      <div className="window h-[140px] bg-white rounded-3xl w-[75%] mx-auto mt-8"></div>
      <h1 className="text-center text-black mt-4 text-xl font-bold">{header}</h1>
      <p className="text-center text-black px-4">{desc.slice(0, 100)}</p>
      <button className="flex mx-auto mt-8 border border-black px-8 py-2 rounded-full text-black font-bold bg-orange-400 hover:bg-white hover:border-orange-400  transition ease-in-out duration-200">
        Join Challenge
      </button>
    </div>
  );
}

export default Box;
