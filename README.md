# Development (Gear) Calculator

PWA for triathlon and time-trial. Given the cassette, average power and target cadence, it estimates the flat-ground speed and proposes three chainrings with even tooth counts and consecutive sizes (large, medium and small) along with the speed table for each gear. Works offline and can be installed on mobile or desktop.

- Spanish and English (Spanish by default) and light/dark mode (light by default).
- SRAM Red/Force cassettes with 11, 12 and 13 speeds, Shimano with 11 and 12 speeds, and a custom cassette option with 11–13 sprockets.
- No dependencies or build step: plain HTML, CSS and JavaScript.

## Publish to GitHub Pages with GitHub Actions

1. Create a new repository on GitHub and upload all contents of this folder, including `.github/`, to the root of the `main` branch.
2. In the repository, go to **Settings → Pages → Build and deployment** and under *Source* choose **GitHub Actions**.
3. Each `git push` to `main` runs the workflow `.github/workflows/deploy.yml` and publishes the site. You can also run it manually from the **Actions → Deploy to GitHub Pages → Run workflow** tab.
4. The first deployment takes one or two minutes. The URL appears in the workflow summary and is usually `https://<username>.github.io/<repository>/`.
5. Open it on your phone and use **Add to Home Screen** (iOS) or **Install app** (Android and Chrome on desktop).

If the deployment fails the first time with a permissions or environment error, check that step 2 is completed before running the workflow.

All routes are relative, so it works the same at the root of a custom domain or in a repository subpath.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Interface, calculations and texts in both languages |
| `manifest.webmanifest` | App name, colors and icons for the installed app |
| `sw.js` | Service worker: cache for offline use |
| `fonts/` | Self-hosted fonts (IBM Plex and Barlow Semi Condensed, SIL OFL 1.1 license) |
| `icons/` | PNG and SVG icons |
| `.github/workflows/deploy.yml` | Automatic deployment to GitHub Pages |
| `.nojekyll` | Prevents Jekyll processing when publishing from a branch instead of Actions |

## Updating the app

Edit the files and `git push` to `main`. The workflow replaces the `CACHE` version in `sw.js` with the commit identifier, so devices that already have the app installed receive updates without any further action. If you publish without Actions, manually update the `CACHE` value (e.g., `desarrollos-v2`, `desarrollos-v3`…) on each change.

## Calculation model

Power at the wheel = power × efficiency = ½·ρ·CdA·v³ + Crr·m·g·v, on flat ground and without wind. Default values: CdA 0.23 m², mass 85 kg, Crr 0.004, ρ 1.19 kg/m³, efficiency 97.5%, wheel 700×28c (2136 mm).
For each even-tooth chainring the app looks for the sprocket closest to the target speed; it qualifies if it is within the cassette's central band (one third of the sprockets) and the required cadence falls within the tolerance (±6 rpm by default). "Large" is the largest chainring that fits and "Medium" and "Small" are the next two smaller chainrings.

## Limitations

- Flat profile and no wind: climbs or wind change real average speed and therefore the optimal sprocket.
- Assumes a single chainring (1x) or the large ring of a 2x setup.
- SRAM tooth counts are verified against manufacturer specs and shop listings; Shimano uses typical series counts. If yours differs, use the "Custom" option.
