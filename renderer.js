const { ipcRenderer } = require('electron');
const { marked } = require('marked');

// DOM elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const previewPanel = document.getElementById('preview-panel');
const fileName = document.getElementById('file-name');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const fileStatus = document.getElementById('file-status');

// Toolbar buttons
const newBtn = document.getElementById('new-btn');
const openBtn = document.getElementById('open-btn');
const saveBtn = document.getElementById('save-btn');
const previewToggle = document.getElementById('preview-toggle');

// State
let currentFilePath = null;
let isModified = false;
let isPreviewVisible = true;

// Configure marked for better security and options
marked.setOptions({
    breaks: true,
    gfm: true
});

// Initialize the editor
function init() {
    updatePreview();
    updateStats();
    updateFileStatus();
    
    // Add event listeners
    editor.addEventListener('input', handleEditorInput);
    editor.addEventListener('keydown', handleKeyDown);
    
    // Toolbar button listeners
    newBtn.addEventListener('click', () => ipcRenderer.send('new-file'));
    openBtn.addEventListener('click', () => ipcRenderer.send('open-file'));
    saveBtn.addEventListener('click', () => ipcRenderer.send('save-file'));
    previewToggle.addEventListener('click', togglePreview);
    
    // Focus the editor
    editor.focus();
}

function handleEditorInput() {
    isModified = true;
    updatePreview();
    updateStats();
    updateFileStatus();
}

function handleKeyDown(event) {
    // Handle tab key for indentation
    if (event.key === 'Tab') {
        event.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        
        if (event.shiftKey) {
            // Shift+Tab: Remove indentation
            const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
            const line = editor.value.substring(lineStart, editor.value.indexOf('\n', start));
            if (line.startsWith('  ')) {
                editor.value = editor.value.substring(0, lineStart) + 
                             line.substring(2) + 
                             editor.value.substring(lineStart + line.length);
                editor.selectionStart = Math.max(lineStart, start - 2);
                editor.selectionEnd = Math.max(lineStart, end - 2);
            }
        } else {
            // Tab: Add indentation
            editor.value = editor.value.substring(0, start) + 
                          '  ' + 
                          editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
        }
        
        handleEditorInput();
    }
}

function updatePreview() {
    if (isPreviewVisible) {
        const content = editor.value;
        if (content.trim() === '') {
            preview.innerHTML = '<p style="color: #6a6a6a; font-style: italic;">Preview will appear here...</p>';
        } else {
            try {
                preview.innerHTML = marked.parse(content);
            } catch (error) {
                preview.innerHTML = '<p style="color: #ff6b6b;">Error rendering markdown: ' + error.message + '</p>';
            }
        }
    }
}

function updateStats() {
    const content = editor.value;
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    const chars = content.length;
    
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
}

function updateFileStatus() {
    fileStatus.textContent = isModified ? '●' : '○';
    fileStatus.style.color = isModified ? '#ff6b6b' : '#4caf50';
}

function togglePreview() {
    isPreviewVisible = !isPreviewVisible;
    
    if (isPreviewVisible) {
        previewPanel.classList.remove('hidden');
        document.querySelector('.editor-panel').classList.remove('full-width');
        previewToggle.style.opacity = '1';
        updatePreview();
    } else {
        previewPanel.classList.add('hidden');
        document.querySelector('.editor-panel').classList.add('full-width');
        previewToggle.style.opacity = '0.5';
    }
}

// IPC event listeners
ipcRenderer.on('new-file', () => {
    editor.value = '';
    currentFilePath = null;
    fileName.textContent = 'Untitled';
    isModified = false;
    updatePreview();
    updateStats();
    updateFileStatus();
    editor.focus();
});

ipcRenderer.on('file-opened', (event, data) => {
    editor.value = data.content;
    currentFilePath = data.filePath;
    fileName.textContent = require('path').basename(data.filePath);
    isModified = false;
    updatePreview();
    updateStats();
    updateFileStatus();
    editor.focus();
});

ipcRenderer.on('save-file', async (event, filePath) => {
    try {
        const result = await ipcRenderer.invoke('save-content', editor.value, filePath);
        if (result.success) {
            currentFilePath = filePath;
            fileName.textContent = require('path').basename(filePath);
            isModified = false;
            updateFileStatus();
        } else {
            alert(`Error saving file: ${result.error}`);
        }
    } catch (error) {
        alert(`Error saving file: ${error.message}`);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
            case 'n':
                event.preventDefault();
                ipcRenderer.send('new-file');
                break;
            case 'o':
                event.preventDefault();
                ipcRenderer.send('open-file');
                break;
            case 's':
                event.preventDefault();
                if (event.shiftKey) {
                    ipcRenderer.send('save-as-file');
                } else {
                    ipcRenderer.send('save-file');
                }
                break;
            case '1':
                event.preventDefault();
                togglePreview();
                break;
        }
    }
});

// Prevent default drag and drop behavior
document.addEventListener('dragover', (event) => {
    event.preventDefault();
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    // You could implement drag and drop file opening here
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Auto-save functionality (optional)
let autoSaveTimeout;
editor.addEventListener('input', () => {
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }
    
    // Auto-save after 2 seconds of inactivity (only if file has been saved before)
    if (currentFilePath) {
        autoSaveTimeout = setTimeout(() => {
            ipcRenderer.send('save-file');
        }, 2000);
    }
});
