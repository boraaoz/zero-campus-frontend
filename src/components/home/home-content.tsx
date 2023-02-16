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

  const [boxNumber, setBoxNumber] = useState(["", "", "", "", ""]);
  return (
    <div className="homepage">
      <h1 className="text-center pb-8 text-4xl font-bold">Challenges</h1>
      <div className="mx-auto gap-8 grid grid-cols-3">
        {boxNumber.map((box, index) => {
          return (
            <Box
              header="Header"
              desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id elit velit. Curabitur cursus facilisis vestibulum. Etiam finibus pellentesque luctus. Ut eu facilisis erat, vel ultrices neque. Pellentesque gravida, elit sed ultrices volutpat, metus nisi fermentum nulla, nec congue metus est non enim. Mauris sit amet nunc justo. "
              key={index}
            />
          );
        })}
      </div>

      <button
        className="flex mx-auto border px-4 py-2 bg-blue-400 border-blue-400 hover:bg-blue-300 hover:border-blue-300 text-gray-100 rounded-lg"
        onClick={() => {
          setBoxNumber([...boxNumber, ""]);
        }}
      >
        Create Challenge
      </button>
    </div>
  );
}
