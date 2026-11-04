export interface Inquiry { name: string; email: string; company: string; type: string; budget: string; location: string; description: string }
export interface SubmitResult { ok: boolean; demo: boolean }

/**
 * Submission abstraction. No mail service or backend is configured for this concept site, so this
 * resolves with `demo: true` and sends nothing. To go live, replace the body with a fetch() to your
 * endpoint (e.g. a Route Handler that calls your email provider) and return `{ ok: res.ok, demo: false }`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function submitInquiry(_data: Inquiry): Promise<SubmitResult> {
  await new Promise((r) => setTimeout(r, 1200));
  return { ok: true, demo: true };
}
