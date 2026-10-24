import type { ReactNode } from "react";
import type { HomeSectionId } from "@/lib/types";
import { Clients } from "./Clients";
import { Cta } from "./Cta";
import { Faq } from "./Faq";
import { Hero } from "./Hero";
import { Posts } from "./Posts";
import { Process } from "./Process";
import { Products } from "./Products";
import { Projects } from "./Projects";
import { Services } from "./Services";
import { Stats } from "./Stats";
import { Team } from "./Team";
import { Tech } from "./Tech";
import { Testimonials } from "./Testimonials";
import { Proof } from "./Proof";
import { Solutions } from "./Solutions";
import { Industries } from "./Industries";
import { WhyUs } from "./WhyUs";
import { Engagement } from "./Engagement";

type P = { title?: string; text?: string };

/** نگاشت شناسه‌ی هر بخش به کامپوننتش؛ ترتیب، نمایش و عنوان‌ها از پنل ادمین (تنظیمات ← بخش‌های صفحه اصلی) تعیین می‌شود. */
export const sectionRegistry: Record<HomeSectionId, (p: P) => ReactNode> = {
  hero: () => <Hero />,
  proof: (p) => <Proof {...p} />,
  stats: () => <Stats />,
  services: (p) => <Services {...p} />,
  solutions: (p) => <Solutions {...p} />,
  products: (p) => <Products {...p} />,
  projects: (p) => <Projects {...p} />,
  industries: (p) => <Industries {...p} />,
  process: (p) => <Process {...p} />,
  whyus: (p) => <WhyUs {...p} />,
  engagement: (p) => <Engagement {...p} />,
  tech: (p) => <Tech {...p} />,
  clients: (p) => <Clients {...p} />,
  testimonials: (p) => <Testimonials {...p} />,
  team: (p) => <Team {...p} />,
  posts: (p) => <Posts {...p} limit={3} />,
  faq: (p) => <Faq {...p} />,
  cta: () => <Cta />,
};
