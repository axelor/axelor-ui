import { Grid } from "./grid";

import Basic from "./demos/basic";
import Aggregation from "./demos/aggregation";
import Editable from "./demos/editable";
import Grouping from "./demos/grouping";
import Navigation from "./demos/navigation";
import Renderer from "./demos/renderer";
import Reorder from "./demos/reorder";
import Resizing from "./demos/resizing";
import Searching from "./demos/searching";
import Selection from "./demos/selection";
import Sorting from "./demos/sorting";
import Expanding from "./demos/expanding";

const stories = {
  component: Grid,
  title: "Advance/Grid",
};

const SingleSelection = () => {
  return <Selection singleSelection />;
};

export {
  Basic,
  Sorting,
  Selection,
  SingleSelection,
  Navigation,
  Grouping,
  Aggregation,
  Renderer,
  Resizing,
  Reorder,
  Searching,
  Editable,
  Expanding,
};

export default stories;
