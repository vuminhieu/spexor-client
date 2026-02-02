# Spexor Client

A desktop application built with **React + Rust** powered by **Tauri v2**.

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 19.x |
| Build Tool | Vite | 7.x |
| Styling | TailwindCSS | 4.x |
| Language | TypeScript | 5.x |
| Backend | Rust | 2021 edition |
| Framework | Tauri | 2.x |

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Rust** via rustup ([Install](https://rustup.rs/))
- **Visual C++ Build Tools** (Windows only)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
# Start development server with hot reload
npm run tauri dev
```

### Build for Production

```bash
npm run tauri build
```

## Project Structure

```
spexor_client/
├── src/                    # React frontend
│   ├── components/
│   │   ├── features/       # Business components
│   │   └── ui/             # Reusable UI
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   └── types/              # TypeScript types
├── src-tauri/              # Rust backend
│   └── src/
│       ├── commands/       # Tauri commands
│       ├── models/         # Data structures
│       └── services/       # Business logic
├── docs/                   # Documentation
└── plans/                  # Implementation plans
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run tauri dev` | Start Tauri development |
| `npm run tauri build` | Build Tauri application |

## License

MIT
