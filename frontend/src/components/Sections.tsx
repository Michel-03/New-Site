import { Box, Button, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { cortex, packages, platform, services, steps, testimonial } from "../content";
import { Reveal, useInView } from "../motion";
import { CoreScene } from "./CoreScene";
import { PageContainer, SectionIntro, TiltCard } from "./ui";

const cardBorder = "rgba(28,22,18,0.09)";
const cardShadow = "0 1px 2px rgba(28,22,18,0.04)";
const cardHoverShadow = "0 24px 50px rgba(28,22,18,0.1)";

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function Services() {
  return (
    <Box as="section" id="services" bg="white" py={{ base: "16", md: "28" }}>
      <PageContainer>
        <SectionIntro
          eyebrow="Our services"
          title="Enterprise AI and data services, delivered end to end."
          body="Six practices under one team. We design the models, the data platforms, and the integrations that connect them to your business."
        />
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }} gap="5" style={{ perspective: "1400px" }}>
          {services.map((service, index) => (
            <Reveal key={service.title} delay={(index % 3) * 110}>
              <TiltCard>
                <Box
                  h="100%"
                  p="7"
                  bg="#fffcf9"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="18px"
                  boxShadow={cardShadow}
                  transition="box-shadow 220ms ease, border-color 220ms ease"
                  _hover={{ boxShadow: cardHoverShadow, borderColor: "rgba(198,90,46,0.35)" }}
                >
                  <Flex align="center" justify="space-between">
                    <Text m="0" color="#9a3b16" fontSize="xs" fontWeight="700" letterSpacing="0.16em">
                      {indexLabel(index)}
                    </Text>
                    <Box w="34px" h="1px" bg="rgba(198,90,46,0.45)" />
                  </Flex>
                  <Heading as="h3" mt="5" mb="0" fontSize="xl" fontFamily="Fraunces, Georgia, serif" fontWeight="560" letterSpacing="-0.01em">
                    {service.title}
                  </Heading>
                  <Text mt="3" mb="0" color="#5e564f" lineHeight="1.75">
                    {service.body}
                  </Text>
                  <Flex mt="6" gap="2" wrap="wrap">
                    {service.tags.map((tag) => (
                      <Text
                        key={tag}
                        m="0"
                        px="2.5"
                        py="1"
                        borderWidth="1px"
                        borderColor="rgba(28,22,18,0.1)"
                        borderRadius="full"
                        color="#3f3833"
                        fontSize="xs"
                        fontWeight="700"
                        letterSpacing="0.02em"
                      >
                        {tag}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </TiltCard>
            </Reveal>
          ))}
        </Grid>
      </PageContainer>
    </Box>
  );
}

export function Platform() {
  return (
    <Box as="section" id="platform" bg="#f6f4f0" py={{ base: "16", md: "28" }} overflow="hidden">
      <PageContainer>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: "10", lg: "16" }} alignItems="center">
          <Box>
            <SectionIntro eyebrow={platform.kicker} title={platform.title} body={platform.body} />
            <Reveal delay={120}>
              <Box
                position="relative"
                h={{ base: "300px", md: "380px" }}
                borderRadius="24px"
                borderWidth="1px"
                borderColor={cardBorder}
                bg="radial-gradient(circle at 50% 45%, rgba(243,221,210,0.9), rgba(246,244,240,0.2) 70%)"
                overflow="hidden"
              >
                <CoreScene />
                <Text
                  position="absolute"
                  left="5"
                  bottom="4"
                  m="0"
                  color="#6d645c"
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.14em"
                  textTransform="uppercase"
                  pointerEvents="none"
                >
                  Your private AI core
                </Text>
              </Box>
            </Reveal>
          </Box>
          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="4" style={{ perspective: "1400px" }}>
            {platform.points.map((point, index) => (
              <Reveal key={point.title} delay={(index % 2) * 100 + Math.floor(index / 2) * 80}>
                <TiltCard>
                  <Box
                    h="100%"
                    p="6"
                    bg="white"
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="16px"
                    boxShadow={cardShadow}
                    transition="box-shadow 220ms ease"
                    _hover={{ boxShadow: cardHoverShadow }}
                  >
                    <Box w="28px" h="28px" mb="4" borderRadius="8px" bg="rgba(198,90,46,0.1)" display="grid" placeItems="center">
                      <Box w="8px" h="8px" borderRadius="2px" bg="#c65a2e" transform="rotate(45deg)" />
                    </Box>
                    <Heading as="h3" m="0" fontSize="lg" fontFamily="Fraunces, Georgia, serif" fontWeight="560">
                      {point.title}
                    </Heading>
                    <Text mt="2" mb="0" color="#5e564f" fontSize="sm" lineHeight="1.65">
                      {point.body}
                    </Text>
                  </Box>
                </TiltCard>
              </Reveal>
            ))}
          </Grid>
        </Grid>
      </PageContainer>
    </Box>
  );
}

export function Process() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <Box as="section" id="process" bg="white" py={{ base: "16", md: "28" }}>
      <PageContainer>
        <SectionIntro
          eyebrow="Our approach"
          title="A structured path from opportunity to production."
          body="Every engagement follows the same five stages, so you always know what is being delivered and what comes next."
        />
        <Box ref={ref} position="relative" data-visible={inView ? "true" : "false"}>
          <Box
            className="ba-timeline-line"
            display={{ base: "none", xl: "block" }}
            position="absolute"
            top="27px"
            left="28px"
            right="28px"
            h="2px"
            bg="linear-gradient(90deg, #c65a2e, rgba(198,90,46,0.25))"
          />
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(5, 1fr)" }} gap="5" style={{ perspective: "1400px" }}>
            {steps.map((step, index) => (
              <Reveal key={step.number} delay={index * 140}>
                <Box position="relative">
                  <Box
                    position="relative"
                    zIndex="1"
                    w="56px"
                    h="56px"
                    borderRadius="full"
                    bg="#1c1612"
                    color="#fffaf5"
                    display="grid"
                    placeItems="center"
                    fontFamily="Fraunces, Georgia, serif"
                    fontSize="lg"
                    boxShadow="0 0 0 6px white, 0 12px 26px rgba(28,22,18,0.2)"
                  >
                    {step.number}
                  </Box>
                  <TiltCard strength={0.7}>
                    <Box mt="5" p="5" bg="#fffcf9" borderWidth="1px" borderColor={cardBorder} borderRadius="16px" h="100%">
                      <Heading as="h3" m="0" fontSize="lg" fontFamily="Fraunces, Georgia, serif" fontWeight="560">
                        {step.title}
                      </Heading>
                      <Text mt="3" mb="0" color="#5e564f" fontSize="sm" lineHeight="1.7">
                        {step.body}
                      </Text>
                    </Box>
                  </TiltCard>
                </Box>
              </Reveal>
            ))}
          </Grid>
        </Box>
      </PageContainer>
    </Box>
  );
}

export function Cortex() {
  return (
    <Box as="section" id="cortex" bg="#1c1612" color="#fffaf5" py={{ base: "16", md: "28" }} position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at 85% 10%, rgba(198,90,46,0.28), transparent 45%), radial-gradient(circle at 10% 90%, rgba(198,90,46,0.16), transparent 40%)"
        pointerEvents="none"
      />
      <PageContainer position="relative">
        <Reveal>
          <Box maxW="720px" mb={{ base: "8", md: "12" }}>
            <Text m="0" color="#e7a07a" fontSize="xs" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
              Byte Analytics Cortex
            </Text>
            <Heading
              as="h2"
              mt="4"
              mb="0"
              fontFamily="Fraunces, Georgia, serif"
              fontWeight="560"
              fontSize={{ base: "2.2rem", md: "3.3rem" }}
              letterSpacing="-0.03em"
              lineHeight="1.04"
            >
              Pre-built AI components for operational work.
            </Heading>
            <Text mt="4" mb="0" color="rgba(255,250,245,0.72)" lineHeight="1.7">
              Accelerate delivery by starting from a proven toolbox, then tailor each component to your data, systems, and governance requirements.
            </Text>
          </Box>
        </Reveal>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(5, 1fr)" }} gap="4" style={{ perspective: "1400px" }}>
          {cortex.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <TiltCard>
                <Box
                  h="100%"
                  p="6"
                  bg="rgba(255,250,245,0.04)"
                  borderRadius="16px"
                  borderWidth="1px"
                  borderColor="rgba(255,250,245,0.12)"
                  transition="border-color 220ms ease, background 220ms ease"
                  _hover={{ borderColor: "rgba(231,160,122,0.6)", bg: "rgba(255,250,245,0.07)" }}
                >
                  <Text m="0" color="#e7a07a" fontSize="xs" fontWeight="700" letterSpacing="0.16em">
                    {indexLabel(index)}
                  </Text>
                  <Heading as="h3" mt="4" mb="0" fontSize="lg" fontFamily="Fraunces, Georgia, serif" fontWeight="560">
                    {item.title}
                  </Heading>
                  <Text mt="3" mb="0" color="rgba(255,250,245,0.7)" fontSize="sm" lineHeight="1.7">
                    {item.body}
                  </Text>
                </Box>
              </TiltCard>
            </Reveal>
          ))}
        </Grid>
      </PageContainer>
    </Box>
  );
}

export function Testimonial() {
  return (
    <Box as="section" bg="white" py={{ base: "16", md: "24" }}>
      <PageContainer>
        <Reveal>
          <Box
            position="relative"
            p={{ base: "8", md: "14" }}
            bg="#f6f4f0"
            borderRadius="28px"
            borderWidth="1px"
            borderColor={cardBorder}
            overflow="hidden"
          >
            <Text
              aria-hidden="true"
              position="absolute"
              top={{ base: "-6", md: "-10" }}
              right={{ base: "4", md: "10" }}
              m="0"
              fontFamily="Fraunces, Georgia, serif"
              fontSize={{ base: "9rem", md: "14rem" }}
              lineHeight="1"
              color="rgba(198,90,46,0.12)"
            >
              “
            </Text>
            <Text m="0" color="#2f6b4f" fontSize="xs" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
              Client perspective
            </Text>
            <Heading
              as="h2"
              position="relative"
              mt="5"
              mb="0"
              maxW="880px"
              color="#1c1612"
              fontFamily="Fraunces, Georgia, serif"
              fontWeight="500"
              fontSize={{ base: "1.8rem", md: "2.6rem" }}
              letterSpacing="-0.025em"
              lineHeight="1.22"
            >
              “{testimonial.quote}”
            </Heading>
            <Flex mt="8" align="center" gap="4">
              <Box w="44px" h="44px" borderRadius="full" bg="#1c1612" color="#fffaf5" display="grid" placeItems="center" fontWeight="700">
                {testimonial.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </Box>
              <Box>
                <Text m="0" fontWeight="700">
                  {testimonial.name}
                </Text>
                <Text m="0" color="#5e564f" fontSize="sm">
                  {testimonial.role}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Reveal>
      </PageContainer>
    </Box>
  );
}

export function Packages({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <Box as="section" id="packages" bg="#f6f4f0" py={{ base: "16", md: "28" }}>
      <PageContainer>
        <SectionIntro
          eyebrow="Engagement models"
          title="Choose the engagement that fits your stage."
          body="Each engagement includes a dedicated team and a monthly allocation of AI support hours."
        />
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap="5" alignItems="stretch" style={{ perspective: "1600px" }}>
          {packages.map((item, index) => (
            <Reveal key={item.name} delay={index * 130}>
              <TiltCard strength={0.6}>
                <Flex
                  direction="column"
                  h="100%"
                  p="7"
                  bg={item.featured ? "#1c1612" : "white"}
                  color={item.featured ? "white" : "#1c1612"}
                  borderWidth="1px"
                  borderColor={item.featured ? "#1c1612" : cardBorder}
                  borderRadius="22px"
                  boxShadow={item.featured ? "0 30px 60px rgba(28,22,18,0.25)" : cardShadow}
                  transform={{ lg: item.featured ? "translateY(-12px)" : "none" }}
                >
                  <Flex justify="space-between" align="center" minH="28px">
                    <Heading as="h3" m="0" fontFamily="Fraunces, Georgia, serif" fontWeight="560" fontSize="2xl">
                      {item.name}
                    </Heading>
                    {item.featured ? (
                      <Text m="0" px="2.5" py="1" bg="#c65a2e" borderRadius="full" fontSize="xs" fontWeight="700">
                        Most selected
                      </Text>
                    ) : null}
                  </Flex>
                  <Text mt="3" mb="0" color={item.featured ? "#f0e6df" : "#5e564f"} lineHeight="1.6">
                    {item.summary}
                  </Text>
                  <Text mt="6" mb="1" fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color={item.featured ? "#e7a07a" : "#9a3b16"}>
                    Recommended for
                  </Text>
                  <Text m="0" color={item.featured ? "#f6f4f0" : "#3f3833"} fontSize="sm" lineHeight="1.6">
                    {item.audience}
                  </Text>
                  <Text mt="6" mb="2" fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color={item.featured ? "#e7a07a" : "#9a3b16"}>
                    Dedicated team
                  </Text>
                  <Box as="ul" m="0" pl="4" color={item.featured ? "#f6f4f0" : "#3f3833"} fontSize="sm" lineHeight="1.9">
                    {item.team.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </Box>
                  <Box mt="auto" pt="7">
                    <Text m="0" fontSize="xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase" color={item.featured ? "#e7a07a" : "#5e564f"}>
                      AI support hours per month
                    </Text>
                    <Text m="0" mt="1" fontFamily="Fraunces, Georgia, serif" fontSize="3xl">
                      {item.hours}
                    </Text>
                    <Button
                      mt="5"
                      w="100%"
                      h="48px"
                      borderRadius="full"
                      bg={item.featured ? "#c65a2e" : "#1c1612"}
                      color="white"
                      fontWeight="700"
                      transition="transform 180ms ease, background 180ms ease"
                      _hover={{ bg: item.featured ? "#a84722" : "#9a3b16", transform: "translateY(-2px)" }}
                      onClick={() => {
                        onSelect(item.name);
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Request a proposal
                    </Button>
                  </Box>
                </Flex>
              </TiltCard>
            </Reveal>
          ))}
        </Grid>
      </PageContainer>
    </Box>
  );
}
