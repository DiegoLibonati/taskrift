# Taskrift

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository
2. Navigate to the project folder
3. Execute: `npm install`
4. Execute: `npm run dev`

The application will open automatically at `http://localhost:3000`

## Description

**Taskrift** is a Kanban-style task management web application built with vanilla TypeScript and no frameworks. It organizes work into three columns — **Tasks To Do**, **In Progress**, and **Finish** — giving you a clear visual overview of everything on your plate at any moment.

Tasks are created by typing into the input field of any column and submitting the form. Each task is saved immediately to `localStorage`, so your board persists across page reloads without any backend or account required.

Once a task exists, you have full control over it through a set of mouse interactions designed to minimize clicks:

- **Drag and drop** a task from one column to another to update its status. The category change is reflected in `localStorage` instantly.
- **Middle-click** (or left-click on mobile screens) to toggle a strikethrough on the task, marking it as visually complete without removing it from the board.
- **Right-click** on a task to delete it immediately from the board and from storage.
- **Click the delete button** (trash icon) on the task card to remove it explicitly.

Each column also has a settings panel with a **Clear All Tasks** action that removes every task in that column at once, both from the DOM and from `localStorage`, leaving tasks in other columns untouched.

The application is entirely client-side, requires no login, and stores all data locally in the browser. It is built as a single-page application (SPA) using Vite as the build tool, TypeScript for type safety, and a component-based architecture where each UI piece is a plain factory function that returns a typed `HTMLElement`.

## Technologies used

1. Javascript
2. CSS3
3. HTML5
4. Vite

## Libraries used

#### Dependencies

```
"uuid": "^9.0.1"
```

#### devDependencies

```
"@eslint/js": "^9.39.2"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/uuid": "^10.0.0"
"eslint": "^9.39.2"
"eslint-config-prettier": "^10.1.8"
"eslint-plugin-prettier": "^5.5.5"
"globals": "^17.3.0"
"husky": "^9.1.7"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^16.2.7"
"prettier": "^3.8.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.54.0"
"vite": "^7.1.6"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/taskrift`](https://www.diegolibonati.com.ar/#/project/taskrift)

## Testing

1. Navigate to the project folder
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Security

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

## Known Issues

None at the moment.
