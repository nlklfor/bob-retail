import Image from "next/image";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Контакти",
  description: "Зв'яжіться з BOB Retail.",
};

export default function ContactsPage() {
  return (
    <div>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-center font-display text-6xl uppercase tracking-tight sm:text-7xl lg:text-8xl">
          Зв&apos;яжіться з нами
        </h1>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          <div className="relative aspect-square sm:aspect-auto">
            <Image
              src="/images/contact_3d.png"
              alt="3D Logo"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="mailto:frombobwithlove@gmail.com"
            className="font-display text-3xl tracking-tight hover:text-highlight sm:text-4xl lg:text-5xl"
          >
            frombobwithlove@gmail.com
          </a>
          <a
            href="tel:+380962414422"
            className="font-display text-3xl tracking-tight hover:text-highlight sm:text-4xl lg:text-5xl"
          >
            096 241 44 22
          </a>
        </div>
      </div>
    </div>
  );
}
