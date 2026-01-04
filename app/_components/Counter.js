"use client";
import { useState } from "react";

function Counter({ users }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button
        onClick={() => {
          setCount((count) => count + 1);
          console.log(users);
        }}
      >
        {count}
      </button>
    </div>
  );
}

export default Counter;
