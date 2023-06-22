import { useState } from "react";
import { Box } from "../box";
import { Input } from "../input";
import { Scrollable } from "./scrollable";

const config = {
  component: Scrollable,
  title: "Core/Scrollable",
};

export default config;

export const Basic = () => {
  const [overflowX, setOverflowX] = useState(false);
  const [overflowY, setOverflowY] = useState(true);

  const handleSetX = () => setOverflowX((prev) => !prev);
  const handleSetY = () => setOverflowY((prev) => !prev);

  const wrapperStyle = overflowX ? { width: 700 } : {};

  return (
    <Box
      d="flex"
      flexDirection="column"
      g={2}
      style={{ width: 500, height: 400 }}
    >
      <Box d="flex" g={3}>
        <Box d="flex" g={2}>
          <strong>Overflow X:</strong>
          <Input type="checkbox" checked={overflowX} onChange={handleSetX} />
        </Box>
        <Box d="flex" g={2}>
          <strong>Overflow Y:</strong>
          <Input type="checkbox" checked={overflowY} onChange={handleSetY} />
        </Box>
      </Box>
      <Box d="flex" border style={{ minHeight: 0 }}>
        <Scrollable overflowX={overflowX} overflowY={overflowY}>
          <Box>
            <Box style={wrapperStyle}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                velit dolorum natus minima, mollitia soluta et amet similique
                quia ad totam perferendis cum praesentium pariatur non incidunt
                expedita iste obcaecati!
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                animi ad eum pariatur labore aliquid molestiae. Perspiciatis
                enim nulla, laborum odit esse iure, deserunt voluptates impedit
                expedita sit fugiat nisi!
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium repellat vitae et vero esse recusandae consequuntur
                aliquam facilis aut blanditiis adipisci nesciunt magnam, enim
                sunt cum dolorem quod asperiores excepturi.
              </p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis, perspiciatis. Ex, velit iure? Commodi, dolorum omnis
                voluptatem nihil, beatae iste saepe eligendi magni fuga
                excepturi similique quod quaerat magnam perspiciatis?
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                suscipit aperiam possimus repellendus voluptas qui nemo omnis,
                harum dolores nisi dolore rem quae magnam provident consequuntur
                optio. Eum, ullam a!
              </p>
            </Box>
          </Box>
        </Scrollable>
      </Box>
    </Box>
  );
};
