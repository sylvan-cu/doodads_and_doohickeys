# Doodads and Doohickeys

A collection of useful components and tools with auto-generated index.

## Features

- **Auto-generated Index**: Dynamically creates an HTML index of all files in the repository
- **File Monitoring**: Automatically updates the index when files are added, removed, or modified
- **Responsive Design**: Mobile-friendly interface for browsing repository contents

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Usage

Generate the index once:
```
npm run generate
```

Watch for file changes and automatically regenerate:
```
npm run watch
```

## How It Works

The project uses:
- Node.js for file system operations
- Nodemon for file watching
- HTML/CSS for the responsive interface

When files are added or modified, the index.html is automatically regenerated to reflect these changes.

## Customization

You can customize the appearance and behavior by editing:
- `generate-index.js` - For index generation logic
- `nodemon.json` - For file watching configuration

## License

ISC

# doodads_and_doohickeys
 projects
