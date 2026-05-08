# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
