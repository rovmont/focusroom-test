# FocusRoom MVP

Interactive prototype of **FocusRoom**, a virtual co-working app where verified college students study together as avatars, without needing a webcam.

Built by **Byte Squad**: Stephen Co, Jose Ponciano David Jr., Joanna Hong, Rovin Niño P. Montaño, and Juan Roberto Pineda.

## What's in the prototype

- **Focus rooms**: silent, avatar-only rooms with shared focus sprints and breaks.
- **Study sessions**: work blocks followed by turn-based discussion, with a rotating host who shares the screen.
- **Activity tracking**: every room shows whether each student is typing, using their cursor, idle, or away. It never records keystrokes or screen content.
- **Accountability**: task declaration with visible progress, mid-session check-ins, wrap-ups, and results revealed together.
- **Safety**: school-email sign-in, a 3-person minimum, no 1-on-1 rooms, and flag with vote-to-remove.

## Running it

It's a static site with no build step. Open `index.html` in a browser, or view the GitHub Pages site.

## Project layout

```
index.html          Page shell: header, tab bar, mount points, and the CSS/JS includes
logo.png
css/                Loaded in order; later files deliberately override earlier ones
  base.css            Design tokens, reset, header, buttons, MoSCoW tags
  landing.css         Welcome hero and feature cards
  rooms.css           Avatars, page frame, room lists and cards
  session.css         Shared session building blocks (timer, tiles, shared screen, fields)
  modal.css           Dialogs and form controls
  pages.css           Outcome, log, Plus, feature map, footer, toast, responsive rules
  rooms-v3.css        Focus room and study session screens, consent sheet
  glass.css           v3.3 liquid-glass material, floating tab bar
  controls.css        v3.4 single control style
js/                 Plain scripts sharing one global scope (inline onclick handlers rely on it)
  core/               glass refraction, icons, sample data and state, helpers, activity tracking, sound
  nav.js              Navigation, return chip, sign-in gate
  views/              welcome, room lists, log, Plus, feature map, outcome
  session/            joining, shared desk/panel pieces, focus room, study session, phases, per-second updates
  modals/             modal templates (render.js) and their actions (actions.js)
  main.js             Clock, top-level render(), boot. Must stay the last script
```

To add a file, add its `<link>` or `<script>` tag to `index.html` in the right spot. Scripts are not ES modules on purpose, so the page keeps working when opened straight from disk.

## Notes

This is a classroom prototype. Sign-in is simulated, rooms and classmates are sample data, and nothing is sent to a server. Activity tracking only reads input inside the page and stays in the browser.
