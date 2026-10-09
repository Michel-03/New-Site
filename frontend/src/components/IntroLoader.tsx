import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Mark } from "./ui";

export function IntroLoader() {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const finish = window.setTimeout(() => setDone(true), 650);
    const remove = window.setTimeout(() => setRemoved(true), 1300);
    return () => {
      window.clearTimeout(finish);
      window.clearTimeout(remove);
    };
  }, []);

  if (removed) return null;

  return (
    <div className="ba-loader" data-done={done ? "true" : "false"} role="status" aria-label="Loading Byte Analytics">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box className="ba-loader-mark" transform="scale(1.6)">
          <Mark />
        </Box>
        <Text
          mt="6"
          mb="0"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="xl"
          fontWeight="560"
          letterSpacing="-0.02em"
          color="#1c1612"
        >
          Byte Analytics
        </Text>
        <div className="ba-loader-bar" />
      </Box>
    </div>
  );
}
