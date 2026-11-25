import { useRef, type MouseEvent, type ReactNode } from "react";
import { Box, Heading, Text, type BoxProps } from "@chakra-ui/react";
import { Reveal } from "../motion";

/** LinkedIn "in" logo, drawn inline so no icon package is needed. */
export function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
