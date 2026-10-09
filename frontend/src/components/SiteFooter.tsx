import { Box, Grid, Link, Text } from "@chakra-ui/react";
import { nav } from "../content";
import { Mark, PageContainer } from "./ui";

export function SiteFooter() {
  return (
    <Box as="footer" bg="#1c1612" color="#f6f4f0" py={{ base: "12", md: "16" }}>
      <PageContainer>
        <Grid templateColumns={{ base: "1fr", md: "1.4fr 1fr" }} gap="10">
          <Box>
            <Box display="flex" alignItems="center" gap="3">
              <Mark light />
              <Text m="0" fontFamily="Fraunces, Georgia, serif" fontSize="xl">
                Byte Analytics
              </Text>
            </Box>
            <Text mt="4" mb="0" maxW="420px" color="#d9cfc7" lineHeight="1.7">
              Artificial intelligence, data platforms, and automation for businesses that want the system to stay theirs.
            </Text>
          </Box>
          <Grid templateColumns="1fr 1fr" gap="6">
            <Box>
              <Text m="0" fontSize="xs" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase" color="#e7a07a">
                Explore
              </Text>
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
              <Text m="0" fontSize="xs" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase" color="#e7a07a">
                Consultancy
              </Text>
              <Text mt="3" mb="0" color="#d9cfc7" lineHeight="1.7">
                Expert in AI consultancy since 2019. We reply to new enquiries within 24 hours.
              </Text>
            </Box>
          </Grid>
        </Grid>
        <Text mt="12" mb="0" color="#b7aea6" fontSize="sm">
          © {new Date().getFullYear()} Byte Analytics. All rights reserved.
        </Text>
      </PageContainer>
    </Box>
  );
}
