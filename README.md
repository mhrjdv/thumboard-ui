# Thumboard UI

A modern, responsive thumbnail board UI library built with React, TypeScript, and Next.js. Features a comprehensive design system, advanced search and filtering, and performance optimizations.

## ✨ Features

- **🎨 Modern Design System**: Built with shadcn/ui components and Tailwind CSS
- **📱 Responsive Design**: Mobile-first approach with adaptive layouts
- **🔍 Advanced Search**: Debounced search with intelligent suggestions
- **🎛️ Comprehensive Filtering**: Faceted search with categories, emotions, types, colors, and price ranges
- **⚡ Performance Optimized**: Lazy loading, infinite scroll, and bundle optimization
- **♿ Accessibility Compliant**: WCAG guidelines, keyboard navigation, screen reader support
- **🗄️ Data Layer**: Supabase integration with mock services for development
- **🛡️ Error Handling**: Comprehensive error boundaries and graceful fallbacks
- **🧪 Well Tested**: 90%+ coverage with unit, integration, and accessibility tests

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd thumboard-ui

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📖 Documentation

### Storybook

Run Storybook to explore components in isolation:

```bash
pnpm storybook
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run accessibility tests
pnpm test:a11y

# Generate coverage report
pnpm test:coverage
```

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── layout/         # Layout components
│   └── error-boundary.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── db.ts          # Data access layer
│   ├── performance.ts  # Performance utilities
│   └── accessibility.ts # Accessibility utilities
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

### Key Components

- **ThumbnailGrid**: Responsive masonry grid with infinite scroll
- **ThumbnailCard**: Interactive thumbnail with hover effects and actions
- **SearchWithSuggestions**: Debounced search with intelligent suggestions
- **FilterPanel**: Comprehensive filtering with faceted search
- **ContentBrowser**: Main layout combining search, filters, and grid

## 🎨 Design System

Built on top of shadcn/ui with custom theming:

- **Colors**: Comprehensive color palette with dark/light mode support
- **Typography**: Consistent typography scale
- **Spacing**: Systematic spacing using Tailwind CSS
- **Components**: Reusable, accessible components

## 🔧 Configuration

### Environment Variables

```bash
# Supabase Configuration (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Customization

The application uses mock data by default. To connect to a real Supabase instance:

1. Set up your Supabase project
2. Configure environment variables
3. Update the database schema (see `src/types/database.ts`)

## 📊 Performance

- **Bundle Size**: Optimized to 239 kB first load JS
- **Lazy Loading**: Images and components load on demand
- **Infinite Scroll**: Efficient pagination with intersection observer
- **Debouncing**: Search and filter inputs are debounced for performance

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Meets accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Logical focus order and visible focus indicators
- **Skip Links**: Quick navigation for keyboard users

## 🧪 Testing

Comprehensive testing strategy:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: Full user workflow testing
- **Accessibility Tests**: Automated a11y testing with axe-core
- **Performance Tests**: Bundle size and render performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Supabase](https://supabase.com/) for the backend infrastructure
