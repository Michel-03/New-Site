import { useEffect } from "react";
import { Box, Button, Heading, Link, Text } from "@chakra-ui/react";
import { contact } from "../content";
import { Mark, PageContainer } from "./ui";

export function NotFoundPage() {
  // On the dev server the title is not rewritten for this page, so set it here.
  useEffect(() => {
    document.title = "Page not found | Byte Analytics";
  }, []);

  return (
    <Box minH="100vh" bg="#f6f4f0" color="#1c1612" fontFamily="Manrope, sans-serif" display="flex" flexDirection="column">
      <Box as="header" borderBottomWidth="1px" borderColor="rgba(28,22,18,0.08)">
        <PageContainer>
          <Box display="flex" h="76px" alignItems="center">
            <Link href="/" display="inline-flex" alignItems="center" gap="3" color="#1c1612" textDecoration="none" aria-label="Byte Analytics home">
              <Mark />
              <Box as="span" fontFamily="Fraunces, Georgia, serif" fontSize="lg" fontWeight="560" letterSpacing="-0.03em">
                Byte Analytics
              </Box>
            </Link>
          </Box>
        </PageContainer>
      </Box>

      <Box as="main" flex="1" display="grid" placeItems="center" py="16">
        <PageContainer maxW="640px">
          <Text m="0" color="#9a3b16" fontSize="xs" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase">
            Error 404
          </Text>
          <Heading
            as="h1"
            mt="3"
            mb="0"
            fontFamily="Fraunces, Georgia, serif"
            fontWeight="560"
            fontSize={{ base: "2.4rem", md: "3.4rem" }}
            letterSpacing="-0.03em"
            lineHeight="1.05"
          >
            We could not find that page.
          </Heading>
          <Text mt="4" mb="0" color="#3f3833" lineHeight="1.7">
            The link may be out of date or mistyped. You can go back to the home page, or email us at {contact.email}.
          </Text>
          <Button
            asChild
            mt="8"
            h="48px"
            px="6"
            bg="#1c1612"
            color="white"
            borderRadius="full"
            fontWeight="700"
            _hover={{ bg: "#9a3b16" }}
          >
            <a href="/">Back to the home page</a>
          </Button>
        </PageContainer>
      </Box>
    </Box>
  );
}
