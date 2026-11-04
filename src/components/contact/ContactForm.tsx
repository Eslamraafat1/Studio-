"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { submitInquiry, type Inquiry } from "@/lib/submitInquiry";
import { useLang } from "@/lib/i18n";
import type { UIKey } from "@/data/ui";

type Errors = Partial<Record<keyof Inquiry, UIKey>>;
const empty: Inquiry = { name: "", email: "", company: "", type: "", budget: "", location: "", description: "" };
const TYPES = ["residential", "cultural", "commercial", "hospitality", "interior", "other"] as const;
const BUDGETS = ["c.b1", "c.b2", "c.b3", "c.b4", "c.b5"] as const;

function validate(v: Inquiry): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "c.required";
  if (!v.email.trim()) e.email = "c.required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "c.emailBad";
  if (!v.type) e.type = "c.required";
  if (!v.budget) e.budget = "c.required";
  if (v.location.trim().length < 2) e.location = "c.required";
  if (v.description.trim().length === 0) e.description = "c.required";
  else if (v.description.trim().length < 30) e.description = "c.descShort";
  return e;
}

export default function ContactForm() {
  const { u } = useLang();
  const uid = useId();
  const [v, setV] = useState<Inquiry>(empty);
  const [err, setErr] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Inquiry, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const summary = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);

  const set = (k: keyof Inquiry, val: string) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched[k] || err[k]) setErr(validate(next));
  };
  const blur = (k: keyof Inquiry) => { setTouched((t) => ({ ...t, [k]: true })); setErr(validate(v)); };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const eMap = validate(v);
    setErr(eMap);
    setTouched({ name: true, email: true, type: true, budget: true, location: true, description: true });
    if (Object.keys(eMap).length) {
      setTimeout(() => {
        summary.current?.focus();
        const first = Object.keys(eMap)[0];
        document.getElementById(`${uid}-${first}`)?.focus();
      }, 0);
      return;
    }
    setState("sending");
    try {
      const r = await submitInquiry(v);
      setState(r.ok ? "done" : "error");
      if (r.ok) setTimeout(() => done.current?.focus(), 50);
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return (
      <div ref={done} tabIndex={-1} role="status" className="border border-line bg-surface p-8 outline-none md:p-12">
        <CheckCircle2 aria-hidden className="mb-6 size-10 text-brand" strokeWidth={1.4} />
        <h2 className="display text-[clamp(2rem,4vw,3.4rem)]">{u("c.okTitle")}</h2>
        <p className="mt-5 max-w-lg text-muted">{u("c.okBody")}</p>
        <dl className="mt-8 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <div><dt className="eyebrow text-muted">{u("c.name")}</dt><dd>{v.name}</dd></div>
          <div><dt className="eyebrow text-muted">{u("c.email")}</dt><dd dir="ltr" className="text-start">{v.email}</dd></div>
        </dl>
        <div className="mt-8"><Button variant="outline" arrow="none" onClick={() => { setV(empty); setErr({}); setTouched({}); setState("idle"); }}>{u("c.again")}</Button></div>
      </div>
    );

  const Field = ({ k, label, type = "text", autoComplete, required = true }: { k: keyof Inquiry; label: string; type?: string; autoComplete?: string; required?: boolean }) => {
    const id = `${uid}-${k}`;
    const bad = err[k];
    return (
      <div>
        <label htmlFor={id} className="eyebrow mb-1 block text-muted">{label}{required && <span aria-hidden className="text-copper"> *</span>}</label>
        <input id={id} name={k} type={type} autoComplete={autoComplete} value={v[k]} required={required} aria-required={required} aria-invalid={!!bad} aria-describedby={bad ? `${id}-e` : undefined} onChange={(e) => set(k, e.target.value)} onBlur={() => blur(k)} className="field" dir={type === "email" ? "ltr" : undefined} style={type === "email" ? { textAlign: "start" } : undefined} />
        {bad && <p id={`${id}-e`} className="mt-2 text-sm text-[#b4442d] dark:text-[#e0836b]" style={{ color: "var(--err, #b4442d)" }}>{u(bad)}</p>}
      </div>
    );
  };
  const Select = ({ k, label, children }: { k: "type" | "budget"; label: string; children: React.ReactNode }) => {
    const id = `${uid}-${k}`;
    const bad = err[k];
    return (
      <div>
        <label htmlFor={id} className="eyebrow mb-1 block text-muted">{label}<span aria-hidden className="text-copper"> *</span></label>
        <select id={id} name={k} value={v[k]} required aria-required aria-invalid={!!bad} aria-describedby={bad ? `${id}-e` : undefined} onChange={(e) => set(k, e.target.value)} onBlur={() => blur(k)} className="field">{children}</select>
        {bad && <p id={`${id}-e`} className="mt-2 text-sm" style={{ color: "#b4442d" }}>{u(bad)}</p>}
      </div>
    );
  };

  const count = Object.keys(err).length;
  return (
    <form onSubmit={onSubmit} noValidate aria-busy={state === "sending"} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <div ref={summary} tabIndex={-1} role="alert" className="outline-none sm:col-span-2">
        {count > 0 && touched.name !== undefined && <p className="border-s-2 border-[#b4442d] ps-4 text-sm">{u("c.fix")}</p>}
        {state === "error" && <p className="border-s-2 border-[#b4442d] ps-4 text-sm">Something went wrong. Please try again.</p>}
      </div>
      {Field({ k: "name", label: u("c.name"), autoComplete: "name" })}
      {Field({ k: "email", label: u("c.email"), type: "email", autoComplete: "email" })}
      {Field({ k: "company", label: u("c.company"), autoComplete: "organization", required: false })}
      {Field({ k: "location", label: u("c.location") })}
      {Select({ k: "type", label: u("c.type"), children: (<><option value="">{u("c.select")}</option>{TYPES.map((x) => <option key={x} value={x}>{u(`c.types.${x}` as UIKey)}</option>)}</>) })}
      {Select({ k: "budget", label: u("c.budget"), children: (<><option value="">{u("c.select")}</option>{BUDGETS.map((x) => <option key={x} value={x}>{u(x)}</option>)}</>) })}
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-description`} className="eyebrow mb-1 block text-muted">{u("c.desc")}<span aria-hidden className="text-copper"> *</span></label>
        <textarea id={`${uid}-description`} name="description" rows={5} value={v.description} required aria-required aria-invalid={!!err.description} aria-describedby={err.description ? `${uid}-description-e` : undefined} onChange={(e) => set("description", e.target.value)} onBlur={() => blur("description")} className="field resize-y" />
        {err.description && <p id={`${uid}-description-e`} className="mt-2 text-sm" style={{ color: "#b4442d" }}>{u(err.description)}</p>}
      </div>
      <div className="flex items-center gap-4 sm:col-span-2">
        <Button type="submit" disabled={state === "sending"} arrow={state === "sending" ? "none" : "right"} magnetic={false}>
          {state === "sending" ? <span className="inline-flex items-center gap-3"><Loader2 aria-hidden className="size-4 animate-spin" />{u("c.sending")}</span> : u("c.submit")}
        </Button>
      </div>
    </form>
  );
}
