# TaskFlow

TaskFlow is a local-first desktop task manager built with Electron, React, and TypeScript. It combines everyday task tracking with kanban planning, statistics, import/export, and AI-assisted task extraction from unstructured text.

## Highlights

- Task CRUD with priorities, tags, due dates, subtasks, and completion status
- List and kanban board views, including drag-and-drop status changes
- Search, sorting, and filters for status, priority, tags, and due date windows
- Statistics dashboard with completion trends and distribution charts
- AI task generation from meeting notes, chat records, notifications, and files
- OpenAI-compatible AI provider support, including DeepSeek, OpenAI, and custom endpoints
- Local data storage through `electron-store`
- JSON and CSV import/export with duplicate filtering
- Light, dark, and system themes
- English and Simplified Chinese UI

## Tech Stack

| Layer | Technology |
| --- | --- |
| Desktop shell | Electron 35 |
| UI | React 19, TypeScript, Tailwind CSS, Radix UI |
| Build | Vite, TypeScript |
| State | Zustand |
| Drag and drop | `@dnd-kit` |
| Charts | Recharts |
| AI client | OpenAI SDK against OpenAI-compatible APIs |
| Storage | `electron-store` |
| Packaging | electron-builder |

## Requirements

- Node.js 18 or newer
- npm

## Getting Started

```bash
npm install
npm run dev
```

The development script starts the Vite renderer and then launches Electron after the dev server is ready.

## Common Commands

```bash
npm run dev          # Start renderer and Electron in development mode
npm run build        # Build renderer and Electron main process
npm run typecheck    # Type-check renderer/shared code and Electron code
npm run lint         # Run ESLint
npm run package:win  # Build Windows installer and portable executable
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`:

```powershell
npm.cmd run typecheck
```

## AI Task Generation

TaskFlow can turn free-form text into structured tasks. Configure it in Settings:

| Provider | Model example | Base URL |
| --- | --- | --- |
| DeepSeek | `deepseek-v4-flash` | `https://api.deepseek.com` |
| OpenAI | `gpt-4o-mini` | `https://api.openai.com` |
| Custom | your model name | any OpenAI-compatible endpoint |

Your API key is saved locally and is only used when calling the configured AI provider.

## Data Model

Tasks are stored locally with this core shape:

```ts
interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  parentId?: string
  order: number
}
```

## Project Structure

```text
TaskFlow/
  electron/              Electron main process, preload bridge, IPC, storage
  shared/                Shared TypeScript types
  src/
    components/
      ai/                AI generation dialog and preview items
      board/             Kanban board
      layout/            App shell, sidebar, header
      settings/          Settings and data import/export
      stats/             Charts and metrics
      tasks/             Task forms, cards, list, details, subtasks
    hooks/               Theme and keyboard shortcut hooks
    i18n/                English and Simplified Chinese translations
    stores/              Zustand task and settings stores
    utils/               Date, import, and export helpers
```

## Build and Package

```bash
npm run build
npm run package:win
```

The production renderer is written to `out/renderer`, and the Electron main process is compiled to `out/main`.

## Privacy

Task data and settings are stored locally. Network requests are only made when you use AI task generation, and those requests go to the provider configured in Settings.

## License

MIT
