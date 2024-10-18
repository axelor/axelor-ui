import { useState } from "react";

import { Rating } from "./rating";

const config = {
  component: Rating,
  title: "Components/Rating",
};

export const Basic = () => {
  const [value, setValue] = useState(2);

  return (
    <Rating value={value} handleClick={(position) => setValue(position)} />
  );
};

export const Heart = () => {
  const [value, setValue] = useState(5);

  return (
    <Rating
      value={value}
      icon="heart"
      max={8}
      handleClick={(position) => setValue(position)}
    />
  );
};

export const Readonly = () => <Rating value={3.5} readonly={true} />;

export const Satisfaction = () => {
  const [value, setValue] = useState(4);

  return (
    <Rating
      value={value}
      icon="emoji-angry,emoji-frown,emoji-neutral,emoji-smile,emoji-laughing"
      color="#d32f2f,#d32f2f,#ed6c02,#2eaa32,#2eaa32"
      highlightSelected={true}
      fill={false}
      text="Satisfaction"
      handleClick={(position) => setValue(position)}
    />
  );
};

export default config;
