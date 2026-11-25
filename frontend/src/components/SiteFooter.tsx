import { Box, Flex, Grid, Link, Text } from "@chakra-ui/react";
import { contact, nav } from "../content";
import { LinkedInIcon, Mark, PageContainer } from "./ui";

const columnTitle = {
  m: "0",
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#e7a07a",
} as const;

export function SiteFooter() {
  return (
    <Box as="footer" bg="#1c1612" color="#f6f4f0" py={{ base: "12", md: "16" }}>
      <PageContainer>
        <Grid templateColumns={{ base: "1fr", md: "1.2fr 1fr" }} gap="10">
          <Box>
            <Box display="flex" alignItems="center" gap="3">
              <Mark light />
              <Text m="0" fontFamily="Fraunces, Georgia, serif" fontSize="xl">
                Byte Analytics
              </Text>
            </Box>
            <Text mt="4" mb="0" maxW="420px" color="#d9cfc7" lineHeight="1.7">
              Data engineering, ML engineering and AI for organisations that want systems they own and can run in production.
            </Text>
          </Box>
          <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="6">
            <Box>
              <Text {...columnTitle}>Explore</Text>
              <Box as="ul" m="0" mt="3" p="0" listStyleType="none">
                {nav.map((item) => (
                  <li key={item.id}>
                    <Link href={`#${item.id}`} display="inline-block" py="1" color="#f6f4f0" textDecoration="none">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </Box>
            </Box>
            <Box>
              <Text {...columnTitle}>Contact</Text>
              <Box as="ul" m="0" mt="3" p="0" listStyleType="none" color="#d9cfc7" lineHeight="1.9">
                <li>
                  <Link href={`mailto:${contact.email}`} color="#f6f4f0" fontSize="sm" whiteSpace="nowrap">
                    {contact.email}
                  </Link>
                </li>
                {contact.phone ? (
                  <li>
                    <Link href={`tel:${contact.phone.replace(/\s/g, "")}`} color="#f6f4f0">
                      {contact.phone}
                    </Link>
                  </li>
                ) : null}
                <li>{contact.address.lines.slice(-1)[0]}</li>
                {contact.linkedin ? (
                  <li>
                    <Link
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="#f6f4f0"
                      display="inline-flex"
                      alignItems="center"
                      gap="2"
                      aria-label="Byte Analytics on LinkedIn (opens in a new tab)"
                    >
                      <LinkedInIcon size={18} />
                      LinkedIn
                    </Link>
                  </li>
                ) : null}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Flex mt="12" justify="space-between" wrap="wrap" gap="3" color="#b7aea6" fontSize="sm">
          <Text m="0">
            © {new Date().getFullYear()} {contact.legalName} All rights reserved.
          </Text>
          <Link href="/privacy" color="#f6f4f0">
            Privacy notice
          </Link>
        </Flex>
      </PageContainer>
    </Box>
  );
}
