# Sriniket Bandaru — Portfolio

A single-page portfolio site built around real client numbers and a
tape-deck motif — scriptwriting, casting, and IP development work for
The Yard, Groww, and independent clients.

## Structure

```
.
├── index.html          # the whole page
├── css/style.css        # all styling
├── js/main.js            # the one bit of interaction (the tape rack)
└── images/                # case-study covers, hero photo, Yard reel thumbnails
```

No build step, no dependencies — it's plain HTML/CSS/JS. Fonts (Besley,
Work Sans, IBM Plex Mono) load from Google Fonts via `<link>` tags in
`index.html`.

## Running it locally

Just open `index.html` in a browser, or serve the folder so relative
image paths resolve cleanly:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

It's static — GitHub Pages, Netlify, Vercel, or any static host will
work with zero configuration. For GitHub Pages: push this to a repo,
then enable Pages on the `main` branch (root).

## Known gaps

- Contact details (`index.html`, near the bottom) are hardcoded —
  update the email, phone, and LinkedIn link if any of those change.
- The tape rack (`js/main.js`) is a stylized index, not a real player —
  clicking a tape shows its title on the "screen" rather than playing
  video, since there's no video asset behind it.
