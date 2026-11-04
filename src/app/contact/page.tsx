import ContactView from "@/components/contact/ContactView";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact",
  description: "Start a project with MONOLITH®. Tell us about your site, programme and budget — we reply within five working days. (Concept website: the form does not send email.)",
  path: "/contact",
});
export default function ContactPage() {
  return <ContactView />;
}
