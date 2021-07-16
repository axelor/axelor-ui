/**
 * @title Flush
 */
import React, { useCallback, useState } from 'react';
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionCollapse,
} from '@axelor-ui/core';

const items = [
  {
    id: 1,
    title: 'Accordion Item #1',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed 
    sapien vel metus feugiat consectetur vitae eu sem. Nam ut tincidunt
    sapien, lobortis consequat enim.`,
  },
  {
    id: 2,
    title: 'Accordion Item #2',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed 
    sapien vel metus feugiat consectetur vitae eu sem. Nam ut tincidunt
    sapien, lobortis consequat enim.`,
  },
  {
    id: 3,
    title: 'Accordion Item #3',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed 
    sapien vel metus feugiat consectetur vitae eu sem. Nam ut tincidunt
    sapien, lobortis consequat enim.`,
  },
];

export default () => {
  const [show, setShow] = useState<number>(-1);

  const toggleShow = (id: number) =>
    useCallback(() => {
      setShow((show: number) => {
        return show === id ? -1 : id;
      });
    }, []);

  return (
    <Box>
      <Accordion flush>
        {items.map(({ id, title, content }) => (
          <AccordionItem key={id}>
            <AccordionHeader onClick={toggleShow(id)} collapsed={show !== id}>
              {title}
            </AccordionHeader>
            <AccordionCollapse in={show === id}>{content}</AccordionCollapse>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};
