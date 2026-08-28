import { Contact } from "@/components/Contact";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return <Contact />;
}
