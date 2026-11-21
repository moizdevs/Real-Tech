export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  location: string;
  city: string;
  /** Phone number for the "Call Now" button, e.g. "+92 3XX XXXXXXX". Leave empty to hide the button. */
  phone: string;
  /** WhatsApp number in international format, digits only, e.g. "923XXXXXXXXX". Empty = WhatsApp opens with a chooser. */
  whatsapp: string;
  /** Social links. Only non-empty values are rendered. */
  social: { facebook: string; instagram: string; youtube: string };
  mapsQuery: string;
};

export const SITE: SiteConfig = {
  name: "Real Tech",
  tagline: "Inverter sales, purchase & repair",
  description:
    "Real Tech in Faisalabad sells new and used inverters, buys old and faulty units, and repairs inverter circuit boards with component-level diagnosis and load testing.",
  location: "Near Jhang Road, Faisalabad, Pakistan",
  city: "Faisalabad",
  phone: "",
  whatsapp: "",
  social: { facebook: "", instagram: "", youtube: "" },
  mapsQuery: "Real Tech inverter repair near Jhang Road Faisalabad",
};

export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  const num = SITE.whatsapp.replace(/\D/g, "");
  return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function telUrl(): string | null {
  const n = SITE.phone.replace(/[^\d+]/g, "");
  return n ? `tel:${n}` : null;
}

export function mapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
}
