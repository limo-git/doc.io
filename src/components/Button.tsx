import React from "react";
import Link, { redirect } from "next/navigation";

const Button = (props) => {
  const [linknav, text] = props;
  return (
    <>
    <button onClick={redirect(`${linknav}`)} className="bg-white">
      {text}
    </button>
    </>
  );
};

export default Button;
