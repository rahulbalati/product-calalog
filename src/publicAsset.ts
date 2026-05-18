/**
 * Media (GLB, PNG, …) is deployed separately from the Vite bundle.
 * Leave VITE_ASSET_BASE_URL unset for same-origin (e.g. S3 website: app + media in one bucket).
 * Set it to another origin (second bucket / CloudFront) when media is hosted elsewhere (configure CORS on that bucket).
 */
const base = (import.meta.env.VITE_ASSET_BASE_URL ?? '').replace(/\/$/, '');

/** Path must start with `/` (e.g. `/assets/model.glb`). */
export function publicAsset(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
