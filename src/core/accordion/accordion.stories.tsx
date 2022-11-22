import { Box } from '../box';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionBody,
} from './accordion';

const config = {
  component: Accordion,
  title: 'Components/Accordion',
};

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

export const Basic = () => {
  return (
    <Box>
      <Accordion>
        {items.map(({ id, title, content }) => (
          <AccordionItem key={id} eventKey={id}>
            <AccordionHeader>{title}</AccordionHeader>
            <AccordionBody>{content}</AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export const AlwaysOpen = () => {
  return (
    <Box>
      <Accordion alwaysOpen>
        {items.map(({ id, title, content }) => (
          <AccordionItem key={id} eventKey={id}>
            <AccordionHeader>{title}</AccordionHeader>
            <AccordionBody>{content}</AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export const Active = () => {
  return (
    <Box>
      <Accordion active={[2, 3]} alwaysOpen>
        {items.map(({ id, title, content }) => (
          <AccordionItem key={id} eventKey={id}>
            <AccordionHeader>{title}</AccordionHeader>
            <AccordionBody>{content}</AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export const Flush = () => {
  return (
    <Box>
      <Accordion flush>
        {items.map(({ id, title, content }) => (
          <AccordionItem key={id} eventKey={id}>
            <AccordionHeader>{title}</AccordionHeader>
            <AccordionBody>{content}</AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default config;
