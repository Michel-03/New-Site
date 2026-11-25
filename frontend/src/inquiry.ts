import { packageNames } from "./content";

export type InquiryDraft = {
  name: string;
  email: string;
  company: string;
  packageInterest: string;
  message: string;
  /** Hidden trap field for bots. Real visitors never see it, so it stays empty. */
  website: string;
};

export const emptyInquiry = (): InquiryDraft => ({
  name: "",
  email: "",
  company: "",
  packageInterest: "Accelerate",
  message: "",
  website: "",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function inquiryErrors(draft: InquiryDraft): string[] {
  const errors: string[] = [];

  if (draft.name.trim().length < 2) {
    errors.push("Enter your name.");
  }

  if (!emailPattern.test(draft.email.trim())) {
    errors.push("Enter a valid work email.");
  }

  if (
    draft.packageInterest &&
    !packageNames.includes(draft.packageInterest)
  ) {
    errors.push("Choose a package.");
  }

  if (draft.message.trim().length < 10) {
    errors.push("Tell us a little more — at least a sentence.");
  }

  return errors;
}

export async function submitInquiry(draft: InquiryDraft): Promise<void> {
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: draft.name.trim(),
      email: draft.email.trim(),
      company: draft.company.trim(),
      packageInterest: draft.packageInterest,
      message: draft.message.trim(),
      website: draft.website,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(body?.message)
      ? body.message.join(" ")
      : body?.message;
    throw new Error(message || "We could not send your message. Please try again.");
  }
}
