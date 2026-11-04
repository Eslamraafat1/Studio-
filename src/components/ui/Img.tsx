"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { useLang } from "@/lib/i18n";

/** next/image with a graceful, designed fallback if the asset fails to load. */
export default function Img({ alt, className, ...rest }: ImageProps) {
  const [bad, setBad] = useState(false);
  const { u } = useLang();
  if (bad)
    return (
      <div role="img" aria-label={String(alt)} className={`eyebrow grid h-full w-full place-items-center bg-alt text-muted ${className ?? ""}`}>
        {u("img.fallback")}
      </div>
    );
  return <Image alt={alt} className={className} onError={() => setBad(true)} {...rest} />;
}
