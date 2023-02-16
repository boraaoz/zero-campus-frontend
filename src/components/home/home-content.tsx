import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { fetcher, useDataFetch } from "@utils/use-data-fetch";
import Box from "@components/Box";
import { Button, ButtonState } from "@components/home/button";
import { toast } from "react-hot-toast";
import { Transaction } from "@solana/web3.js";
import { SignCreateData } from "@pages/api/sign/create";
import { SignValidateData } from "@pages/api/sign/validate";
import { useState, useEffect } from "react";
import Modal from "@components/Modal";

export function HomeContent() {
  const { publicKey, signTransaction } = useWallet();
  const [signState, setSignState] = React.useState<ButtonState>("initial");

  const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");

  // Reset the state if wallet changes or disconnects
  React.useEffect(() => {
    if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
      prevPublickKey.current === publicKey.toBase58();
      setSignState("initial");
    }
  }, [publicKey]);

  // This will request a signature automatically but you can have a separate button for that
  React.useEffect(() => {
    async function sign() {
      if (publicKey && signTransaction && signState === "initial") {
        setSignState("loading");
        const signToastId = toast.loading("Signing message...");

        try {
          // Request signature tx from server
          const { tx: createTx } = await fetcher<SignCreateData>(
            "/api/sign/create",
            {
              method: "POST",
              body: JSON.stringify({
                publicKeyStr: publicKey.toBase58(),
              }),
              headers: { "Content-type": "application/json; charset=UTF-8" },
            }
          );

          const tx = Transaction.from(Buffer.from(createTx, "base64"));

          // Request signature from wallet
          const signedTx = await signTransaction(tx);

          // Validate signed transaction
          await fetcher<SignValidateData>("/api/sign/validate", {
            method: "POST",
            body: JSON.stringify({
              signedTx: signedTx.serialize().toString("base64"),
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          });

          setSignState("success");
          toast.success("Message signed", { id: signToastId });
        } catch (error: any) {
          setSignState("error");
          toast.error("Error verifying wallet, please reconnect wallet", {
            id: signToastId,
          });
        }
      }
    }

    sign();
  }, [signState, signTransaction, publicKey]);

  const onSignClick = () => {
    setSignState("initial");
  };
  const example = {
    header: "Header",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit velit. Curabitur cursus facilisis vestibulum. Etiam finibus pellentesque luctus. Ut eu facilisis erat, vel ultrices neque. Pellentesque gravida, elit sed ultrices volutpat, metus nisi fermentum nulla, nec congue metus est non enim. Mauris sit amet nunc justo. ",
  };

  const createExample = (example: { header: string; desc: string }) => {
    setBoxNumber([...boxNumber, example]);
  };
  const [boxNumber, setBoxNumber] = useState([example, example, example]);
  const [show, setModalShow] = useState<boolean>(false);
  return (
    <div className="homepage">
      <h1 className="text-center text-black pb-8 text-4xl font-bold">
        Challenges
      </h1>
      {show && <Modal onSubmit={createExample} setShow={setModalShow} />}
      <div className="mx-auto gap-8 grid grid-cols-3">
        {boxNumber.map((box, index) => {
          return <Box header={box.header} desc={box.desc} key={index} />;
        })}
      </div>

      <button
        className="flex mx-auto text-black border px-4 py-2 bg-orange-400 border-black hover:bg-white hover:text-black hover:border-black-300 text-gray-100 rounded-full mt-10"
        onClick={() => {
          setModalShow(true);
        }}
      >
        Create Challenge
      </button>
    </div>
  );
}
