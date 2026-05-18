Place catalog images and GLBs here **mirroring** the paths the app expects under `/assets/…` (same layout as `public/assets/` for local dev).

Example:

- `assets/BP-51C.glb`
- `assets/BP-51C_MFP.png`
- `assets/finisher/Finisher_01.png`
- …

**Full deploy (build + S3 + CloudFront cache bust)** — from repo root:

```text
npm run build
aws s3 sync dist s3://YOUR_BUCKET_NAME/ --exclude ".DS_Store"
aws s3 sync public/assets s3://YOUR_BUCKET_NAME/assets --exclude ".DS_Store"
aws cloudfront create-invalidation --distribution-id YOUR_CF_DISTRIBUTION_ID --paths "/" "/index.html" "/assets/*"
```

Do **not** use `--delete` on `dist` → bucket root if the bucket also holds media keys under `assets/` that are not present in `dist/`.

Deploy media only (or from `deploy/s3-media/`):

```text
aws s3 sync deploy/s3-media/ s3://YOUR_BUCKET_NAME/ --exclude README.md
```

**Cache large models at the browser (S3 metadata only, no app code):** set `Cache-Control` on `.glb` / `.obj` / `.fbx` when uploading, or refresh metadata on objects already in the bucket:

```text
aws s3 sync public/assets s3://YOUR_BUCKET_NAME/assets --exclude ".DS_Store" --exclude "*" --include "*.glb" --include "*.obj" --include "*.fbx" --cache-control "public, max-age=31536000, immutable"
```

To rewrite metadata **without re-uploading** every byte (same keys):

```text
aws s3 cp s3://YOUR_BUCKET_NAME/assets/ s3://YOUR_BUCKET_NAME/assets/ --recursive --exclude "*" --include "*.glb" --include "*.obj" --include "*.fbx" --metadata-directive REPLACE --cache-control "public, max-age=31536000, immutable"
```

Use long `max-age` only when you are OK caching until users clear cache or you change the file URL. Prefer new filenames when you replace a model.

Use `--content-type model/gltf-binary` for `.glb` if you need explicit types (see AWS CLI `cp` / sync metadata options).
