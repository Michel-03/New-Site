import { useState, type FormEvent } from "react";
import { Box, Button, Field, Grid, Input, NativeSelect, Stack, Textarea } from "@chakra-ui/react";
import { packages } from "../content";
import { emptyInquiry, inquiryErrors, submitInquiry, type InquiryDraft } from "../inquiry";
import { Reveal } from "../motion";
import { toaster } from "../toaster";
import { PageContainer, SectionIntro } from "./ui";

type ContactSectionProps = {
  packageInterest: string;
  onPackageChange: (name: string) => void;
};

export function ContactSection({ packageInterest, onPackageChange }: ContactSectionProps) {
  const [draft, setDraft] = useState<InquiryDraft>(() => ({
    ...emptyInquiry(),
    packageInterest,
  }));
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");

  const selectedPackage = draft.packageInterest === packageInterest ? draft.packageInterest : packageInterest;
  const form: InquiryDraft = { ...draft, packageInterest: selectedPackage };

  function update(field: keyof InquiryDraft, value: string) {
    if (field === "packageInterest") {
      onPackageChange(value);
    }
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = inquiryErrors(form);
    setErrors(nextErrors);
    if (nextErrors.length > 0) {
      return;
    }

    setStatus("sending");
    try {
      await submitInquiry(form);
      const firstName = form.name.trim().split(" ")[0];
      toaster.create({
        title: "Message received.",
        description: `Thanks, ${firstName}. We will reply to ${form.email.trim()} within 24 hours about the ${form.packageInterest} package.`,
        type: "success",
      });
      setDraft({ ...emptyInquiry(), packageInterest: form.packageInterest });
      setErrors([]);
      setStatus("idle");
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "We could not send your message."]);
      setStatus("failed");
    }
  }

  return (
    <Box as="section" id="contact" bg="white" py={{ base: "16", md: "24" }}>
      <PageContainer>
        <Grid templateColumns={{ base: "1fr", lg: "0.85fr 1.15fr" }} gap={{ base: "8", lg: "16" }}>
          <SectionIntro
            eyebrow="Contact"
            title="Discuss your requirements with our team."
            body="Share a few details about your organisation and objectives. A senior consultant will respond within 24 hours."
          />

          <Reveal delay={120}>
          <Box
            as="form"
            onSubmit={onSubmit}
            p={{ base: "5", md: "8" }}
            bg="#f6f4f0"
            borderRadius="22px"
            borderWidth="1px"
            borderColor="rgba(28,22,18,0.08)"
            boxShadow="0 24px 50px rgba(28,22,18,0.06)"
          >
              <Stack gap="4">
                <Field.Root required>
                  <Field.Label fontWeight="700">Name</Field.Label>
                  <Input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    bg="white"
                    h="48px"
                    borderColor="rgba(28,22,18,0.14)"
                    autoComplete="name"
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label fontWeight="700">Work email</Field.Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    bg="white"
                    h="48px"
                    borderColor="rgba(28,22,18,0.14)"
                    autoComplete="email"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontWeight="700">Company</Field.Label>
                  <Input
                    value={form.company}
                    onChange={(event) => update("company", event.target.value)}
                    bg="white"
                    h="48px"
                    borderColor="rgba(28,22,18,0.14)"
                    autoComplete="organization"
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label fontWeight="700">Package</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={form.packageInterest}
                      onChange={(event) => update("packageInterest", event.target.value)}
                      bg="white"
                      h="48px"
                      borderColor="rgba(28,22,18,0.14)"
                    >
                      {packages.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root>
                <Field.Root required>
                  <Field.Label fontWeight="700">How can we help?</Field.Label>
                  <Textarea
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    bg="white"
                    minH="140px"
                    borderColor="rgba(28,22,18,0.14)"
                  />
                </Field.Root>

                {errors.length > 0 ? (
                  <Box as="ul" m="0" pl="5" color="#9a3b16" role="alert">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </Box>
                ) : null}

                <Button
                  type="submit"
                  h="48px"
                  px="6"
                  alignSelf="flex-start"
                  bg="#1c1612"
                  color="white"
                  borderRadius="full"
                  fontWeight="700"
                  loading={status === "sending"}
                  _hover={{ bg: "#9a3b16" }}
                >
                  Send enquiry
                </Button>
              </Stack>
            </Box>
          </Reveal>
        </Grid>
      </PageContainer>
    </Box>
  );
}
