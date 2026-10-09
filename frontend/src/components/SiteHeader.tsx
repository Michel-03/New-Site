import { useState } from "react";
import { Box, Button, Flex, Link, Stack } from "@chakra-ui/react";
import { nav } from "../content";
import { Mark, PageContainer } from "./ui";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      as="header"
      className="ba-enter-header"
      position="sticky"
      top="0"
      zIndex="30"
      bg="rgba(246,244,240,0.9)"
      backdropFilter="blur(16px)"
      borderBottomWidth="1px"
      borderColor="rgba(28,22,18,0.08)"
    >
      <PageContainer>
        <Flex h="76px" align="center" justify="space-between" gap="6">
          <Link
            href="#top"
            display="inline-flex"
            alignItems="center"
            gap="3"
            color="#1c1612"
            textDecoration="none"
            aria-label="Byte Analytics home"
          >
            <Mark />
            <Box
              as="span"
              fontFamily="Fraunces, Georgia, serif"
              fontSize="lg"
              fontWeight="560"
              letterSpacing="-0.03em"
            >
              Byte Analytics
            </Box>
          </Link>

          <Flex as="nav" display={{ base: "none", lg: "flex" }} gap="7" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                color="#3f3833"
                fontSize="sm"
                fontWeight="600"
                textDecoration="none"
                _hover={{ color: "#9a3b16" }}
              >
                {item.label}
              </Link>
            ))}
          </Flex>

          <Flex align="center" gap="3">
            <Button
              asChild
              display={{ base: "none", md: "inline-flex" }}
              h="42px"
              px="5"
              bg="#9a3b16"
              color="white"
              borderRadius="full"
              fontWeight="700"
              _hover={{ bg: "#7d2f10" }}
            >
              <a href="#contact">Get in touch</a>
            </Button>
            <Button
              display={{ base: "inline-flex", lg: "none" }}
              variant="outline"
              h="42px"
              px="4"
              borderColor="rgba(28,22,18,0.16)"
              borderRadius="full"
              bg="transparent"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              {open ? "Close" : "Menu"}
            </Button>
          </Flex>
        </Flex>

        {open ? (
          <Stack
            id="mobile-nav"
            as="nav"
            display={{ base: "flex", lg: "none" }}
            direction="column"
            align="stretch"
            gap="1"
            pb="5"
            aria-label="Mobile"
          >
            {nav.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                display="block"
                py="2"
                color="#1c1612"
                fontWeight="600"
                textDecoration="none"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        ) : null}
      </PageContainer>
    </Box>
  );
}
