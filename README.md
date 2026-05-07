# TaskFlow

A powerful and beautiful task management desktop application built with Electron, React, and TypeScript.

## Features

- **Task Management**: Create, edit, delete, and organize your tasks with ease
- **Multiple Views**: Switch between list view and kanban board view
- **Priority Levels**: Set priority levels (Low, Medium, High, Urgent) with color coding
- **Tags & Categories**: Organize tasks with custom tags
- **Subtasks**: Break down complex tasks into manageable subtasks
- **Due Dates**: Set deadlines and get visual indicators for overdue tasks
- **Search & Filter**: Quickly find tasks with powerful search and filtering
- **Dark Mode**: Beautiful dark theme that's easy on the eyes
- **Statistics**: Visualize your productivity with charts and analytics
- **Data Import/Export**: Export your data as JSON/CSV and import it back
- **Internationalization**: Support for Chinese and English
- **Keyboard Shortcuts**: Boost your productivity with keyboard shortcuts
- **Local Storage**: All data stored locally on your device for privacy

## Screenshots

> Coming soon...

## Tech Stack

- **Desktop Framework**: Electron
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite + electron-vite
- **State Management**: Zustand
- **UI Components**: Tailwind CSS + Radix UI
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **Internationalization**: i18next
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/RedTemperature/taskflow.git
cd taskflow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Package for your platform
npm run package:win   # Windows
npm run package:mac   # macOS
npm run package:linux # Linux
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Toggle task status (when task selected) |
| `Ctrl/Cmd + Delete` | Delete task (when task selected) |
| `Escape` | Deselect task |
| `Ctrl/Cmd + 1` | Go to Tasks |
| `Ctrl/Cmd + 2` | Go to Statistics |
| `Ctrl/Cmd + 3` | Go to Settings |

## Project Structure

```
TaskFlow/
├── electron/          # Electron main process
│   ├── main.ts        # Main process entry
│   ├── preload.ts     # Preload script (secure bridge)
│   ├── store.ts       # Data persistence layer
│   └── ipc.ts         # IPC handlers
├── src/               # React renderer process
│   ├── components/    # React components
│   │   ├── layout/    # Layout components
│   │   ├── tasks/     # Task management components
│   │   ├── board/     # Kanban board components
│   │   ├── stats/     # Statistics components
│   │   ├── settings/  # Settings components
│   │   └── common/    # Shared components
│   ├── hooks/         # Custom React hooks
│   ├── stores/        # Zustand state stores
│   ├── utils/         # Utility functions
│   ├── i18n/          # Internationalization
│   └── styles/        # Global styles
├── shared/            # Shared types between main and renderer
├── .github/           # GitHub templates and workflows
└── resources/         # App icons and resources
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ by TaskFlow Contributors
