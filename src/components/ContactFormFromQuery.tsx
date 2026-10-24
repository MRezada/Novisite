"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";

export function ContactFormFromQuery({ email }: { email: string }) {
  const params = useSearchParams();
  const subject = params.get("subject") || "project";
  const modules = params.get("modules");
  const message = modules ? `ماژول‌های موردنظر ما: ${modules}\n\nتعداد کاربران / شرایط استقرار / سیستم‌هایی که باید متصل شوند:` : "";
  return <ContactForm key={`${subject}:${modules}`} defaultSubject={subject} defaultMessage={message} email={email} />;
}
