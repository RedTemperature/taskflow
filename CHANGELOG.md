# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-09

### Added
- AI-powered task generation from unstructured text
- Multi-provider support via OpenAI-compatible API (DeepSeek, OpenRouter, etc.)
- Configurable model name, API URL, and API key in Settings
- Provider presets (DeepSeek, OpenRouter) with one-click setup

### Changed
- **Breaking**: Replaced Anthropic SDK with OpenAI SDK for broader provider compatibility
- JSON output now enforced via `response_format: json_object`

[1.1.0]: https://github.com/RedTemperature/taskflow/releases/tag/v1.1.0

## [1.0.0] - 2026-05-08

### Added
- Task management (CRUD operations)
- List view and kanban board view with drag-and-drop
- Task priority levels (Low, Medium, High, Urgent)
- Tags and categories
- Subtasks support
- Due dates with time picker
- Search and filtering
- Dark mode support (light/dark/system)
- Statistics and charts
- Data import/export (JSON, CSV) with deduplication
- Internationalization (Chinese, English)
- Keyboard shortcuts
- Local data persistence
- NSIS installer with custom installation directory
- Portable executable build

### Fixed
- Renderer path not found in production build (white screen)
- Data directory inconsistency between dev and production
- Today's tasks incorrectly marked as overdue
- Import now skips duplicate tasks by ID

[1.0.0]: https://github.com/RedTemperature/taskflow/releases/tag/v1.0.0
