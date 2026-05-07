# Contributing to TaskFlow

Thank you for your interest in contributing to TaskFlow! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

Please be respectful to all contributors and maintainers. We are committed to providing a welcoming and inclusive experience for everyone.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch for your feature or fix

## Development Workflow

1. Make sure you have Node.js 18+ installed
2. Run `npm run dev` to start the development server
3. Make your changes
4. Test your changes thoroughly
5. Run `npm run lint` to check for linting errors
6. Run `npm run typecheck` to verify TypeScript types

## Pull Request Process

1. Update the README.md if you're adding new features
2. Update the documentation if needed
3. Ensure all tests pass (when available)
4. Make sure your code follows the coding standards
5. Submit your pull request with a clear description

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all props and state
- Avoid using `any` type
- Use interfaces for object shapes

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow the single responsibility principle

### Styling

- Use Tailwind CSS for styling
- Follow the existing color scheme
- Ensure dark mode compatibility
- Use responsive design principles

### File Naming

- Use PascalCase for component files: `TaskCard.tsx`
- Use camelCase for utility files: `dateUtils.ts`
- Use kebab-case for CSS files: `globals.css`

## Commit Messages

Follow the conventional commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(tasks): add subtask support
fix(board): fix drag and drop ordering
docs(readme): update installation instructions
```

## Reporting Bugs

When reporting bugs, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots if applicable
6. Your environment (OS, Node.js version, etc.)

## Suggesting Features

When suggesting features:

1. Explain the problem you're trying to solve
2. Describe the solution you'd like
3. Consider alternatives
4. Add any additional context

## Questions?

If you have questions, feel free to open an issue or reach out to the maintainers.

Thank you for contributing to TaskFlow! 🎉
