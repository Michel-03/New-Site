import { Fragment, lazy, Suspense, type CSSProperties } from "react";
import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { bookingHref, company, journey, stats } from "../content";
import { CountUp } from "../motion";
import { Eyebrow, PageContainer } from "./ui";

const PipelineScene = lazy(() => import("./PipelineScene").then((module) => ({ default: module.PipelineScene })));

const enter = (delay: number) => ({
  className: "ba-enter",
  style: { "--ba-delay": `${delay}ms` } as CSSProperties,
});

export function Hero() {
  return (
    <Box
      as="section"
      id="top"
      position="relative"
      overflow="hidden"
      bg="#f6f4f0"
      backgroundImage="linear-gradient(rgba(28,22,18,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(28,22,18,0.04) 1px, transparent 1px)"
      backgroundSize="72px 72px"
      pt={{ base: "12", md: "20" }}
    >
      <PageContainer textAlign="center">
        <Box {...enter(700)}>
          <Eyebrow>{company.eyebrow}</Eyebrow>
        </Box>
        <Heading
          as="h1"
          mt="5"
          mx="auto"
          maxW="1000px"
          color="#1c1612"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="560"
          fontSize={{ base: "2.5rem", md: "4.4rem" }}
          letterSpacing="-0.035em"
          lineHeight="1"
        >
          <Box as="span" display="block" {...enter(820)}>
            {company.headlineLead}
          </Box>
          <Box as="span" display="block" color="#c65a2e" {...enter(960)}>
            {company.headlineAccent}
          </Box>
        </Heading>
        <Text
          mx="auto"
          mt="6"
          mb="0"
          maxW="740px"
          color="#5e564f"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          {...enter(1100)}
        >
          {company.summary}
        </Text>
        <Flex mt="8" justify="center" gap="3" wrap="wrap" {...enter(1240)}>
          <Button
            asChild
            h="50px"
            px="7"
            bg="#1c1612"
            color="white"
            borderRadius="full"
            fontWeight="700"
            boxShadow="0 10px 24px rgba(28,22,18,0.18)"
            transition="transform 180ms ease, box-shadow 180ms ease, background 180ms ease"
            _hover={{ bg: "#9a3b16", transform: "translateY(-2px)", boxShadow: "0 16px 30px rgba(154,59,22,0.28)" }}
          >
            <a href={bookingHref()} target={bookingHref().startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              Book a 30-min call
            </a>
          </Button>
          <Button
            asChild
            h="50px"
            px="7"
            bg="rgba(255,252,249,0.7)"
            color="#1c1612"
            borderWidth="1px"
            borderColor="rgba(28,22,18,0.16)"
            borderRadius="full"
            fontWeight="700"
            transition="transform 180ms ease, background 180ms ease"
            _hover={{ bg: "white", transform: "translateY(-2px)" }}
          >
            <a href="#case-studies">View case studies</a>
          </Button>
        </Flex>

        <Grid
          mt="12"
          mx="auto"
          maxW="860px"
          templateColumns={{ base: "1fr", md: "1fr auto 1fr auto 1fr" }}
          gap={{ base: "3", md: "3" }}
          alignItems="stretch"
          {...enter(1380)}
        >
          {journey.map((step, index) => (
            <Fragment key={step.title}>
              <Box
                h="100%"
                textAlign="left"
                p="5"
                bg={step.dark ? "#1c1612" : "rgba(255,252,249,0.96)"}
                color={step.dark ? "#fffaf5" : "#1c1612"}
                borderWidth="1px"
                borderColor={step.dark ? "#1c1612" : "rgba(28,22,18,0.08)"}
                borderRadius="18px"
                boxShadow={step.dark ? "0 24px 48px rgba(28,22,18,0.22)" : "0 14px 30px rgba(28,22,18,0.06)"}
              >
                <Flex align="center" gap="3">
                  <Box
                    w="34px"
                    h="34px"
                    borderRadius="10px"
                    bg={step.dark ? "rgba(231,160,122,0.18)" : "rgba(198,90,46,0.1)"}
                    display="grid"
                    placeItems="center"
                  >
                    <Box w="8px" h="8px" borderRadius="2px" bg={step.dark ? "#e7a07a" : "#c65a2e"} transform="rotate(45deg)" />
                  </Box>
                  <Text
                    m="0"
                    fontSize="xs"
                    fontWeight="700"
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                    color={step.dark ? "#e7a07a" : "#9a3b16"}
                  >
                    {step.number} · {step.tag}
                  </Text>
                </Flex>
                <Heading as="h3" mt="4" mb="1" fontSize="lg" fontFamily="Fraunces, Georgia, serif" fontWeight="560">
                  {step.title}
                </Heading>
                <Text m="0" color={step.dark ? "rgba(255,250,245,0.7)" : "#5e564f"} fontSize="sm">
                  {step.detail}
                </Text>
              </Box>
              {index < journey.length - 1 ? (
                <Box
                  aria-hidden="true"
                  display={{ base: "none", md: "block" }}
                  alignSelf="center"
                  w="36px"
                  h="2px"
                  bg="linear-gradient(90deg, rgba(198,90,46,0.25), #c65a2e)"
                  position="relative"
                  _after={{
                    content: '""',
                    position: "absolute",
                    right: "-2px",
                    top: "-4px",
                    borderLeft: "6px solid #c65a2e",
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                  }}
                />
              ) : null}
            </Fragment>
          ))}
        </Grid>
      </PageContainer>

      <Box mt={{ base: "6", md: "2" }} position="relative" {...enter(1380)}>
        <Box
          h={{ base: "340px", md: "520px" }}
          style={{
            maskImage: "linear-gradient(to bottom, transparent, #000 4%, #000 86%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 4%, #000 86%, transparent)",
          }}
        >
          <Suspense fallback={null}>
            <PipelineScene />
          </Suspense>
        </Box>
        <PageContainer position="relative" mt={{ base: "0", md: "-16" }} pb={{ base: "10", md: "14" }}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            bg="rgba(255,252,249,0.86)"
            borderWidth="1px"
            borderColor="rgba(28,22,18,0.08)"
            borderRadius="18px"
            backdropFilter="blur(8px)"
            boxShadow="0 20px 50px rgba(28,22,18,0.08)"
            overflow="hidden"
          >
            {stats.map((stat, index) => (
              <Box
                key={stat.label}
                px={{ base: "5", md: "7" }}
                py="6"
                textAlign="left"
                borderLeftWidth={{ base: "0", md: index === 0 ? "0" : "1px" }}
                borderTopWidth={{ base: index > 0 ? "1px" : "0", md: "0" }}
                borderColor="rgba(28,22,18,0.08)"
              >
                <Text
                  m="0"
                  fontFamily="Fraunces, Georgia, serif"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  color="#1c1612"
                  letterSpacing="-0.03em"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <CountUp to={stat.value} from={stat.from} prefix={stat.prefix} suffix={stat.suffix} />
                </Text>
                <Text m="0" mt="1" color="#5e564f" fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Grid>
          <Text mt="5" mb="0" textAlign="center" color="#6d645c" fontSize="sm" fontWeight="600" letterSpacing="0.04em">
            Experience with · {company.experience.join("  ·  ")}
          </Text>
          <Flex mt="3" justify="center" gap="2" wrap="wrap" aria-label="Industries">
            {company.industries.map((industry) => (
              <Text
                key={industry}
                m="0"
                px="3"
                py="1"
                bg="rgba(47,107,79,0.08)"
                color="#2f6b4f"
                borderRadius="full"
                fontSize="xs"
                fontWeight="700"
                letterSpacing="0.04em"
              >
                {industry}
              </Text>
            ))}
          </Flex>
        </PageContainer>
      </Box>
    </Box>
  );
}
