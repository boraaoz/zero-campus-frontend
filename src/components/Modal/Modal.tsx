import React from "react";

function Modal({
  onSubmit,
  setShow,
}: {
  onSubmit: (example: { header: string; desc: string }) => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="bg-opacity-60 flex items-center justify-center bg-black w-screen h-screen absolute top-0 left-0">
      <div className="form relative bg-red-500 rounded-xl px-20">
        <div
          onClick={() => {
            setShow(false);
          }}
          className="absolute text-black font-bold right-5 top-5 cursor-pointer"
        >
          X
        </div>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            const header = e.target.header.value;
            const desc = e.target.desc.value;
            onSubmit({ header, desc });
            setShow(false);
          }}
          className="pb-48 py-12 flex flex-col "
        >
          <h1 className="text-white font-bold text-center">Header</h1>
          <input
            name="header"
            className="bg-white px-1 text-black rounded border border-black outline-none"
          />
          <h1 className="text-white font-bold text-center">Description</h1>
          <input
            name="desc"
            className="bg-white px-1 mb-12  text-black rounded border border-black  outline-none"
          />
          <button className=" text-white bg-black py-2 rounded-full border border-black  hover:bg-white hover:text-black transition ease-in-out duration-300 font-bold">
            Create Challenge
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
