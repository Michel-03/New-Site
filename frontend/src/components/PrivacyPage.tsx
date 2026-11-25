import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { contact, privacy } from "../content";
import { Mark, PageContainer } from "./ui";

export function PrivacyPage() {
  return (
    <Box minH="100vh" bg="#f6f4f0" color="#1c1612" fontFamily="Manrope, sans-serif">
      <Box as="header" borderBottomWidth="1px" borderColor="rgba(28,22,18,0.08)" bg="rgba(246,244,240,0.9)">
        <PageContainer>
          <Box display="flex" h="76px" alignItems="center" justifyContent="space-between" gap="4">
            <Link href="/" display="inline-flex" alignItems="center" gap="3" color="#1c1612" textDecoration="none" aria-label="Byte Analytics home">
              <Mark />
              <Box as="span" fontFamily="Fraunces, Georgia, serif" fontSize="lg" fontWeight="560" letterSpacing="-0.03em">
                Byte Analytics
              </Box>
            </Link>
            <Link href="/" color="#9a3b16" fontWeight="700" fontSize="sm">
              ← Back to site
            </Link>
          </Box>
        </PageContainer>
      </Box>

      <Box as="main" py={{ base: "12", md: "20" }}>
        <PageContainer maxW="760px">
          <Heading
            as="h1"
            m="0"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="560"
            fontSize={{ base: "2.4rem", md: "3.4rem" }}
            letterSpacing="-0.03em"
            lineHeight="1.05"
          >
            {privacy.title}
          </Heading>
          <Text mt="3" mb="0" color="#6d645c" fontSize="sm">
            Last updated {privacy.updated}
          </Text>

          {privacy.sections.map((section) => (
            <Box as="section" key={section.title} mt="10">
              <Heading as="h2" m="0" fontFamily="Fraunces, Georgia, serif" fontWeight="560" fontSize="2xl" letterSpacing="-0.01em">
                {section.title}
              </Heading>
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} mt="3" mb="0" color="#3f3833" lineHeight="1.75">
                  {paragraph}
                </Text>
              ))}
            </Box>
          ))}
        </PageContainer>
      </Box>

      <Box as="footer" borderTopWidth="1px" borderColor="rgba(28,22,18,0.08)" py="8">
        <PageContainer>
          <Text m="0" color="#6d645c" fontSize="sm">
            © {new Date().getFullYear()} {contact.legalName} All rights reserved.
          </Text>
        </PageContainer>
      </Box>
    </Box>
  );
}
