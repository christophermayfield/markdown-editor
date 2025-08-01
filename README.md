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

1. Make sure you have Node.js installed
2. Clone or download this project
3. Open terminal and navigate to the project directory
4. Install dependencies:
   ```bash
   npm install
   ```

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
