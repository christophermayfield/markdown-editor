# Markdown Editor

A simple, elegant markdown editor for macOS built with Electron. Features a split-pane interface with live preview, syntax highlighting, and native file operations.

## Features

- **Split-pane interface** with editor and live preview
- **Real-time markdown rendering** using marked.js
- **Native file operations** (New, Open, Save, Save As)
- **Support for .md and .txt files**
- **Dark theme** optimized for macOS
- **Auto-save functionality** (saves automatically after 2 seconds of inactivity)
- **Word and character count** in status bar
- **Keyboard shortcuts** for common operations
- **Tab support** for indentation

## Installation

### Option 1: Install Pre-built Application (Recommended)

1. **Download the appropriate .dmg file for your Mac:**
   - For Apple Silicon Macs (M1, M2, M3, etc.): `Markdown Editor-1.0.0-arm64.dmg`
   - For Intel Macs: `Markdown Editor-1.0.0-x64.dmg`

2. **Install the application:**
   - Double-click the downloaded .dmg file
   - A window will open showing the Markdown Editor app and an Applications folder
   - Drag the "Markdown Editor" app to the Applications folder
   - Wait for the copy to complete
   - Eject the .dmg file

3. **Launch the application:**
   - Open Finder and go to Applications
   - Find "Markdown Editor" and double-click to launch
   - If you see a security dialog, click "Open" to confirm

### Option 2: Build from Source (For Developers)

1. **Prerequisites:**
   - Node.js (version 16 or later)
   - npm (comes with Node.js)

2. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd markdown-editor
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm start
   ```

4. **Build distribution files:**
   ```bash
   npm run dist
   ```
   This creates .dmg files in the `dist/` folder for both Intel and Apple Silicon Macs.

## System Requirements

- **macOS**: 10.12 Sierra or later
- **Architecture**: Supports both Intel (x64) and Apple Silicon (ARM64) Macs
- **Disk Space**: ~100 MB for installation
- **Memory**: 512 MB RAM minimum

## Troubleshooting

### Security Warning on First Launch
If you see a warning like "Markdown Editor cannot be opened because it is from an unidentified developer":
1. Go to System Preferences → Security & Privacy
2. Click "Open Anyway" next to the blocked app message
3. Or right-click the app and select "Open" from the context menu

### Application Won't Start
- Make sure you're using the correct version for your Mac architecture (ARM64 for Apple Silicon, x64 for Intel)
- Try restarting your Mac and launching the app again
- Check that you have sufficient disk space and memory available

### File Operations Not Working
- Ensure the app has permission to access files in System Preferences → Security & Privacy → Privacy → Files and Folders
- Try running the app with administrator privileges if file access issues persist

## Usage

### Running the Application

```bash
npm start
```

For development mode with DevTools:
```bash
npm run dev
```

### Keyboard Shortcuts

- `Cmd+N` - New file
- `Cmd+O` - Open file
- `Cmd+S` - Save file
- `Cmd+Shift+S` - Save As
- `Cmd+1` - Toggle preview panel
- `Tab` - Indent selected text
- `Shift+Tab` - Unindent selected text

### File Operations

- **New**: Creates a new untitled document
- **Open**: Supports .md, .markdown, .txt, and all file types
- **Save**: Saves the current document
- **Save As**: Save with a new name/location

### Interface

- **Editor Panel**: Left side with syntax highlighting
- **Preview Panel**: Right side with rendered markdown
- **Toolbar**: Quick access to file operations and preview toggle
- **Status Bar**: Shows word count, character count, and file status

## Building for Distribution

To build the app for distribution:

```bash
npm run dist
```

This will create a `.dmg` file in the `dist` folder that you can distribute.

## Supported Markdown Features

- Headers (H1-H6)
- **Bold** and *italic* text
- Links and images
- Code blocks and inline code
- Lists (ordered and unordered)
- Blockquotes
- Tables
- Line breaks
- Strikethrough

## Customization

### Themes
The editor uses a dark theme by default. You can modify the colors in `styles.css`.

### Markdown Options
Markdown rendering options can be configured in `renderer.js` by modifying the `marked.setOptions()` call.

## Development

The project structure:
- `main.js` - Main Electron process
- `renderer.js` - Renderer process (UI logic)
- `index.html` - Main HTML file
- `styles.css` - Styling
- `package.json` - Project configuration

## License

MIT License - feel free to use and modify as needed.
