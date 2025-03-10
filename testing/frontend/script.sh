#!/bin/bash

# Create project directories
mkdir -p src/components src/pages

# Create files in the root directory
touch eslint.config.js index.html package.json postcss.config.js tailwind.config.js tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts

# Create files in the src directory
touch src/App.tsx src/index.css src/main.tsx src/vite-env.d.ts

# Create files in the components directory
touch src/components/Header.tsx src/components/Sidebar.tsx

# Create files in the pages directory
touch src/pages/AssignmentsPage.tsx \
      src/pages/CollaboratePage.tsx \
      src/pages/DoubtPage.tsx \
      src/pages/NotesPage.tsx \
      src/pages/RelaxPage.tsx \
      src/pages/SettingsPage.tsx \
      src/pages/StudyMaterialPage.tsx \
      src/pages/TodoPage.tsx

echo "Project structure created successfully."