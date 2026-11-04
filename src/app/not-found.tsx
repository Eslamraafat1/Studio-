"use client";
import Button from "@/components/ui/Button";
import { useLang } from "@/lib/i18n";

export default function NotFound() {
  const { u } = useLang();
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center gap-8 pt-32">
      <p className="num text-copper">404</p>
      <h1 className="display text-[clamp(2.6rem,8vw,8rem)]">{u("nf.title")}</h1>
      <div><Button href="/">{u("nf.back")}</Button></div>
    </section>
  );
}
