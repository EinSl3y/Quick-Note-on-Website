# Quick-Note-on-Website

Create, manage, and interact with sticky notes on **any website** using simple keyboard shortcuts.  
Perfect for quick thoughts, annotations, or reminders — all saved persistently on the page.

---

## Features

- ✅ **Create notes** anywhere with keyboard shortcuts.
- ✅ **Smart positioning**: notes appear near text selection if present, otherwise at mouse cursor.
- ✅ **Resizable & draggable** notes.
- ✅ **Persistent storage**: all notes are saved using `localStorage`.
- ✅ **Cyclic color system**: notes rotate between 4 soft colors.
- ✅ **Undo support** (like `Ctrl + Z`).
- ✅ **Delete mode**: quickly delete notes with a single click.
- ✅ **Toggle all notes** visibility instantly.

---

## Keyboard Shortcuts

| Shortcut           | Action                                 |
|--------------------|----------------------------------------|
| `Ctrl + Y`         | Create a new note                      |
| `Alt + Y`          | Toggle delete mode (click to delete)   |
| `Alt + Z`          | Undo the last deleted note             |
| `Ctrl + Alt`       | Show/Hide all notes at once            |

---

## Note Behavior

- **Auto-expanding**: The note grows with content.
- **Movable**: Drag by clicking and holding inside the note.
- **Color rotation**: New notes rotate through:
  -  Yellow
  -  Light Blue
  -  Pink
  -  Light Green
- **Delete mode**:
  - Enables one-click delete of any note.
  - Deleted notes can be restored using `Alt + Z`.

---

## Data Storage

- Notes are stored in the browser using `localStorage`, unique per website.
- Deleting a note removes it permanently from storage (but can be undone if you act fast!).

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension in your browser.
2. Create a new script and paste the `script code` inside.
3. Save the script and reload your target website.
4. Start using shortcuts to add notes instantly!

---

## Note

This tool is client-side only and does not sync across devices or browsers.
For syncing, you may consider integrating with cloud APIs or browser storage sync options.

---

## Author

Created by **EinSone**  
Feel free to fork, adapt, and improve this tool!

---

## License

This project is open-sourced under the MIT License.

