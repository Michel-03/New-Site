import type { CSSProperties } from "react";
import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { company, stats } from "../content";
import { CountUp } from "../motion";
import { PipelineScene } from "./PipelineScene";
import { Eyebrow, PageContainer } from "./ui";

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
          maxW="920px"
          color="#1c1612"
          fontFamily="Fraunces, Georgia, serif"
          fontWeight="560"
          fontSize={{ base: "3.1rem", md: "5.35rem" }}
          letterSpacing="-0.035em"
          lineHeight="0.96"
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
            <a href="#contact">Schedule a consultation</a>
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
            <a href="#services">Explore our services</a>
          </Button>
        </Flex>
      </PageContainer>

      <Box mt={{ base: "6", md: "2" }} position="relative" {...enter(1380)}>
        <Box
          h={{ base: "340px", md: "520px" }}
          style={{
            maskImage: "linear-gradient(to bottom, transparent, #000 4%, #000 86%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 4%, #000 86%, transparent)",
          }}
        >
          <PipelineScene />
        </Box>
        <PageContainer position="relative" mt={{ base: "0", md: "-16" }} pb={{ base: "10", md: "14" }}>
          <Grid
            templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
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
                borderLeftWidth={{ base: index % 2 === 0 ? "0" : "1px", md: index === 0 ? "0" : "1px" }}
                borderTopWidth={{ base: index > 1 ? "1px" : "0", md: "0" }}
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
                  <CountUp to={stat.value} from={stat.from} suffix={stat.suffix} />
                </Text>
                <Text m="0" mt="1" color="#5e564f" fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Grid>
          <Text mt="5" mb="0" textAlign="center" color="#6d645c" fontSize="sm" fontWeight="600" letterSpacing="0.04em">
            Technology partners · {company.platforms.join("  ·  ")}
          </Text>
        </PageContainer>
      </Box>
    </Box>
  );
}
