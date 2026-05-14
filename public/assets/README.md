# Assets (not in Git)

This folder is **ignored by Git** except for this file. Large binaries (`.glb`, `.obj`, images, accessories) should live in **external storage** (S3, Azure Blob, CDN, etc.).

**Local development:** copy or download your media here so paths like `/assets/...` used in the app resolve correctly.

**Production:** either upload `public/assets` during deploy from your storage pipeline, or change the app to load model/image URLs from your CDN base URL.
