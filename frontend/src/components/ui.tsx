import { useRef, type MouseEvent, type ReactNode } from "react";
import { Box, Heading, Text, type BoxProps } from "@chakra-ui/react";
import { Reveal } from "../motion";

export function Mark({ light = false }: { light?: boolean }) {
  const stroke = light ? "#F6F4F0" : "#1C1612";
  const accent = light ? "#E7A07A" : "#C65A2E";

  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect
        x="1.2"
        y="1.2"
        width="29.6"
        height="29.6"
        rx="8"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
      />
      <path
        d="M8 23.2 L16 8.2 L24 23.2"
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="18.4" r="1.8" fill={stroke} />
    </svg>
  );
}

export function TiltCard({ children, strength = 1 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-y * 8 * strength).toFixed(2)}deg) rotateY(${(x * 9 * strength).toFixed(2)}deg) translateY(-6px)`;
    if (shine.current) {
      shine.current.style.opacity = "1";
      shine.current.style.background = `radial-gradient(circle at ${((x + 0.5) * 100).toFixed(1)}% ${((y + 0.5) * 100).toFixed(1)}%, rgba(255,255,255,0.38), transparent 55%)`;
    }
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = "";
    if (shine.current) shine.current.style.opacity = "0";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
      <div
        ref={shine}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 200ms ease",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}

export function PageContainer(props: BoxProps) {
  return (
    <Box mx="auto" w="100%" maxW="1160px" px={{ base: "5", md: "8" }} {...props} />
  );
}

export function Eyebrow({ children }: { children: string }) {
  return (
    <Text
      m="0"
      display="inline-flex"
      alignItems="center"
      gap="2"
      color="#2f6b4f"
      fontSize="xs"
      fontWeight="700"
      letterSpacing="0.16em"
      textTransform="uppercase"
    >
      <Box as="span" w="6px" h="6px" borderRadius="full" bg="#2f6b4f" />
      {children}
    </Text>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <Reveal>
    <Box maxW="720px" mb={{ base: "8", md: "12" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading
        as="h2"
        mt="4"
        mb="0"
        color="#1c1612"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="560"
        fontSize={{ base: "2.2rem", md: "3.3rem" }}
        letterSpacing="-0.03em"
        lineHeight="1.02"
      >
        {title}
      </Heading>
      {body ? (
        <Text mt="4" mb="0" color="#5e564f" fontSize="md" lineHeight="1.7">
          {body}
        </Text>
      ) : null}
    </Box>
    </Reveal>
  );
}
