# Grok Scroll Extension

A browser extension that adds a convenient navigation panel for Grok chat messages, making it easier to jump between different parts of a conversation.

## Features

- Automatically creates a navigation panel for all messages in a Grok chat
- Displays message previews for quick identification
- Allows one-click navigation to any message in the conversation
- Updates in real-time when new messages are added
- Adapts to page navigation and URL changes
- Clean, unobtrusive design that matches the Grok interface

## Installation

1. Clone this repository or download the source code
2. Load the extension in your browser:
   - **Chrome**: Go to `chrome://extensions/`, enable Developer mode, and click "Load unpacked"
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select any file from the extension folder
   - **Edge**: Go to `edge://extensions/`, enable Developer mode, and click "Load unpacked"

## Usage

1. Visit [Grok](https://grok.com) and start or open a conversation
2. The navigation panel will automatically appear on the top-right of the page
3. Click on any message preview to instantly scroll to that message

## Project Structure

- `manifest.json` - Extension configuration file
- `content.js` - Main script that injects the navigation panel into the page

## Development

The extension uses vanilla JavaScript and doesn't require any build process. The main functionality is in `content.js`, which injects the navigation panel into the Grok chat interface.

To modify the extension:
1. Edit the files as needed
2. Reload the extension in your browser's extensions page
3. Refresh any open Grok tabs

## License

[MIT License](LICENSE) 