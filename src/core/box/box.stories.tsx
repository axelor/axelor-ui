import { Box } from "./box";

const config = {
  component: Box,
  title: "Layout/Box",
};

export const Basic = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }}>
      <Box p={4} border>
        {t("welcome")}
      </Box>
    </Box>
  );
};

export const Border = ({ t }: any) => {
  return (
    <Box display="flex">
      <Box p={5} m={2} border>
        {t("square")}
      </Box>
      <Box p={5} m={2} border rounded={2} borderWidth={2}>
        {t("rounded")}
      </Box>
      <Box p={5} m={2} border borderColor="primary">
        {t("primary")}
      </Box>
      <Box p={5} m={2} borderTop bgColor="light">
        {t("top")}
      </Box>
      <Box p={5} m={2} borderEnd bgColor="light">
        {t("end")}
      </Box>
      <Box p={5} m={2} borderBottom bgColor="light">
        {t("bottom")}
      </Box>
      <Box p={5} m={2} borderStart bgColor="light">
        {t("start")}
      </Box>
    </Box>
  );
};

const colors: any = {
  primary: "white",
  secondary: "white",
  success: "white",
  danger: "white",
  warning: "dark",
  info: "dark",
  light: "dark",
  dark: "white",
  body: "dark",
  white: "dark",
  transparent: "dark",
};

const gradientIgnore = ["body", "white", "transparent"];

export const Background = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>).map((c) => (
        <Box key={c} p={3} m={2} bgColor={c} color={colors[c]}>
          {t(c)}
        </Box>
      ))}
    </Box>
  );
};

export const Gradient = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }}>
      {(Object.keys(colors) as Array<any>)
        .filter((c) => gradientIgnore.indexOf(c) === -1)
        .map((c) => (
          <Box key={c} p={3} m={2} bgColor={c} color={colors[c]} bgGradient>
            {t(c)} {t("gradient")}
          </Box>
        ))}
    </Box>
  );
};

export const BoxShadow = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }} bgColor="light" p={4}>
      <Box shadow={false} p={3} mb={5} bgColor="body" rounded={2}>
        {t("No Shadow")}
      </Box>
      <Box shadow p={3} mb={5} bgColor="body" rounded={2}>
        {t("Regular Shadow")}
      </Box>
      <Box shadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Small Shadow")}
      </Box>
      <Box shadow="md" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Medium Shadow")}
      </Box>
      <Box shadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Large Shadow")}
      </Box>
      <Box shadow="xl" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Larger Shadow")}
      </Box>
      <Box shadow="2xl" p={3} mb={5} bgColor="body" rounded={2}>
        {t("2x Larger Shadow")}
      </Box>
      <Box shadow="inner" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Inner Shadow")}
      </Box>
    </Box>
  );
};

export const DropShadow = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }} bgColor="light" p={4}>
      <Box dropShadow={false} p={3} mb={5} bgColor="body" rounded={2}>
        {t("No Shadow")}
      </Box>
      <Box dropShadow p={3} mb={5} bgColor="body" rounded={2}>
        {t("Regular Shadow")}
      </Box>
      <Box dropShadow="sm" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Small Shadow")}
      </Box>
      <Box dropShadow="md" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Medium Shadow")}
      </Box>
      <Box dropShadow="lg" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Large Shadow")}
      </Box>
      <Box dropShadow="xl" p={3} mb={5} bgColor="body" rounded={2}>
        {t("Larger Shadow")}
      </Box>
      <Box dropShadow="2xl" p={3} mb={5} bgColor="body" rounded={2}>
        {t("2x Larger Shadow")}
      </Box>
    </Box>
  );
};

export const Display = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }}>
      <Box mb={2}>
        <Box d="inline" p={1} bgColor="primary" color="white">
          {t("inline")}
        </Box>
        <Box d="inline" p={1} bgColor="dark" color="white">
          {t("inline")}
        </Box>
      </Box>
      <Box mb={2}>
        <Box d="block" p={1} bgColor="primary" color="white">
          {t("block")}
        </Box>
        <Box d="block" p={1} bgColor="dark" color="white">
          {t("block")}
        </Box>
      </Box>
    </Box>
  );
};

export const Float = ({ t }: any) => {
  return (
    <Box>
      <Box float="start">{t("Float start on all viewport sizes")}</Box>
      <br />
      <Box float="end">{t("Float end on all viewport sizes")}</Box>
      <br />
      <Box float="none">{t("Don't float on all viewport sizes")}</Box>
    </Box>
  );
};

export const Link = ({ t }: any) => {
  return (
    <Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="primary">
        {`${t("link")}-${t("primary")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="secondary">
        {`${t("link")}-${t("secondary")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="success">
        {`${t("link")}-${t("success")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="danger">
        {`${t("link")}-${t("danger")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="warning">
        {`${t("link")}-${t("warning")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="info">
        {`${t("link")}-${t("info")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="light">
        {`${t("link")}-${t("light")}`}
      </Box>
      <Box as="a" href="#" p={1} mb={1} linkColor="dark">
        {`${t("link")}-${t("dark")}`}
      </Box>
    </Box>
  );
};

export const PointerEvents = ({ t }: any) => {
  return (
    <Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="none" aria-disabled="true">
          {t("This link")}
        </Box>{" "}
        {t("can not be clicked.")}
      </Box>
      <Box as="p">
        <Box as="a" href="#" pointerEvents="auto">
          {t("This link")}
        </Box>{" "}
        {t("can be clicked (this is default behavior).")}
      </Box>
      <Box as="p" pointerEvents="none">
        <Box as="a" href="#" aria-disabled="true">
          {t("This link")}
        </Box>{" "}
        {t(
          "can not be clicked because the pointer-events property is inherited from its parent. However,"
        )}{" "}
        <Box as="a" href="#" pointerEvents="auto">
          {t("This link")}
        </Box>{" "}
        {t("has a pe-auto class and can be clicked.")}
      </Box>
    </Box>
  );
};

export const Text = ({ t }: any) => {
  return (
    <Box style={{ width: 400 }}>
      <Box p={1} mb={1} color="primary">
        {`${t("text")}-${t("primary")}`}
      </Box>
      <Box p={1} mb={1} color="secondary">
        {`${t("text")}-${t("secondary")}`}
      </Box>
      <Box p={1} mb={1} color="success">
        {`${t("text")}-${t("success")}`}
      </Box>
      <Box p={1} mb={1} color="danger">
        {`${t("text")}-${t("danger")}`}
      </Box>
      <Box p={1} mb={1} color="warning" bgColor="dark">
        {`${t("text")}-${t("warning")}`}
      </Box>
      <Box p={1} mb={1} color="info" bgColor="dark">
        {`${t("text")}-${t("info")}`}
      </Box>
      <Box p={1} mb={1} color="light" bgColor="dark">
        {`${t("text")}-${t("light")}`}
      </Box>
      <Box p={1} mb={1} color="dark">
        {`${t("text")}-${t("dark")}`}
      </Box>
      <Box p={1} mb={1} color="body">
        {`${t("text")}-${t("body")}`}
      </Box>
      <Box p={1} mb={1} color="muted">
        {`${t("text")}-${t("muted")}`}
      </Box>
      <Box p={1} mb={1} color="white" bgColor="dark">
        {`${t("text")}-${t("white")}`}
      </Box>
      <Box p={1} mb={1} color="black-50">
        {`${t("text")}-${t("black_50")}`}
      </Box>
      <Box p={1} mb={1} color="white-50" bgColor="dark">
        {`${t("text")}-${t("white_50")}`}
      </Box>
    </Box>
  );
};

export const TextAlign = ({ t }: any) => {
  return (
    <Box>
      <Box as="p" textAlign="start">
        {t("Start aligned text on all viewport sizes.")}
      </Box>
      <Box as="p" textAlign="center">
        {t("Center aligned text on all viewport sizes.")}
      </Box>
      <Box as="p" textAlign="end">
        {t("End aligned text on all viewport sizes.")}
      </Box>
      <Box as="p" textAlign={{ sm: "start" }}>
        {t("Start aligned text on viewports sized SM (small) or wider.")}
      </Box>
      <Box as="p" textAlign={{ md: "start" }}>
        {t("Start aligned text on viewports sized MD (medium) or wider.")}
      </Box>
      <Box as="p" textAlign={{ lg: "start" }}>
        {t("Start aligned text on viewports sized LG (large) or wider.")}
      </Box>
      <Box as="p" textAlign={{ xl: "start" }}>
        {t("Start aligned text on viewports sized XL (extra-large) or wider.")}
      </Box>
    </Box>
  );
};

export const FontSize = ({ t }: any) => {
  return (
    <Box>
      <Box as="p" fontSize={1}>
        {t("fontSize")}={`{1}`} {t("text")}
      </Box>
      <Box as="p" fontSize={2}>
        {t("fontSize")}={`{2}`} {t("text")}
      </Box>
      <Box as="p" fontSize={3}>
        {t("fontSize")}={`{3}`} {t("text")}
      </Box>
      <Box as="p" fontSize={4}>
        {t("fontSize")}={`{4}`} {t("text")}
      </Box>
      <Box as="p" fontSize={5}>
        {t("fontSize")}={`{5}`} {t("text")}
      </Box>
      <Box as="p" fontSize={6}>
        {t("fontSize")}={`{6}`} {t("text")}
      </Box>
    </Box>
  );
};

export const FontWeight = ({ t }: any) => {
  return (
    <Box>
      <Box as="p" fontWeight="bold">
        {t("Bold text.")}
      </Box>
      <Box as="p" fontWeight="bolder">
        {t("Bolder weight text (relative to the parent element).")}
      </Box>
      <Box as="p" fontWeight="normal">
        {t("Normal weight text.")}
      </Box>
      <Box as="p" fontWeight="light">
        {t("Light weight text.")}
      </Box>
      <Box as="p" fontWeight="lighter">
        {t("Lighter weight text (relative to the parent element).")}
      </Box>
      <Box as="p" fontStyle="italic">
        {t("Italic text.")}
      </Box>
      <Box as="p" fontStyle="normal">
        {t("Text with normal font style")}
      </Box>
    </Box>
  );
};

export const Overflow = ({ t }: any) => {
  return (
    <Box display="flex">
      <Box
        overflow="auto"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="light"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        {t("This is an example of using")} <code>{t(".overflow-auto")}</code>{" "}
        {t(
          "on an element with set width and height dimensions. By design, this content will vertically scroll."
        )}
      </Box>
      <Box
        overflow="hidden"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="light"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        {t("This is an example of using")} <code>{t(".overflow-hidden")}</code>{" "}
        {t("on an element with set width and height dimensions.")}
      </Box>
      <Box
        overflow="visible"
        p={3}
        mb={{
          base: 3,
          md: 0,
        }}
        me={{
          md: 3,
        }}
        bgColor="light"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        {t("This is an example of using")} <code>{t(".overflow-visible")}</code>{" "}
        {t("on an element with set width and height dimensions.")}
      </Box>
      <Box
        overflow="scroll"
        p={3}
        bgColor="light"
        style={{
          maxWidth: 260,
          maxHeight: 100,
        }}
      >
        {t("This is an example of using")} <code>{t(".overflow-scroll")}</code>{" "}
        {t("on an element with set width and height dimensions.")}
      </Box>
    </Box>
  );
};

export default config;
