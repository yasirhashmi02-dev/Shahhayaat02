# Shah Hayaat: fixes and release checklist

## Changes applied
- Replaced two missing about-page image URLs with existing local images (these are placeholders, not recovered originals).
- Removed three accidentally duplicated HTML pages from `/images/`.
- Replaced the two contradictory Brain Champ and Blood Storm catalog dosage strings with label-verification guidance.
- Removed categorical Brain Champ safety, interaction, and results-timeline statements.
- Clarified that contact form opens a WhatsApp draft, added native validation and privacy notice, and stopped clearing fields automatically.
- Removed unused generic fetch-based contact handler.
- Suspended carousel rotation for reduced-motion users, hidden tabs, and slide hover/focus.
- Removed Cloudflare-specific email decoder and restored the direct email link.
- Added non-JS fallback headings to dynamically rendered product pages.
- Added Sangh Bust to sitemap and viewport metadata to quiz redirect.
- Made Wellness Lab's non-diagnostic limitations more prominent.
- Added intrinsic image dimensions where local source files could be resolved.

## Must be verified before release
1. **Clinical/regulatory review:** Check all product SKUs, formulations, dosage, contraindications, age suitability, prices, claimed certifications and medical marketing claims against approved packaging and applicable rules. No dosage was invented.
2. **Wellness Lab:** Clinical validation of scores, thresholds, interpretations and PDF report remains outstanding. Do not advertise results as diagnostic.
3. **Analytics and privacy:** Audit actual consent behavior, privacy policy, analytics scripts and applicable legal requirements.
4. **Security:** Configure and test CSP and HSTS against the live HTTPS hosting setup. A guessed CSP could break this inline-script-heavy site.
5. **QA:** Test contact WhatsApp handoff, all purchase links, dynamic product pages, responsive layouts, screen readers, browser console and performance on deployed site.
6. **Imagery:** Confirm the substituted about-page images match the intended creative direction.
7. **Asset optimization:** Deduplicate only after verifying deployed references and visual fidelity.

This is a static-source repair pass, not certification of live security, clinical claims or production functionality.
