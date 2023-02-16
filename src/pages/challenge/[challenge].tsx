import { useRouter } from "next/router";
import React from "react";

function Challenge() {
  const router = useRouter();
  const { challenge } = router.query;
  // get ?header=
  // get ?desc= from router

  const { header, desc } = router.query;

  return (
    <div>
      {header} {desc}
    </div>
  );
}

export default Challenge;
