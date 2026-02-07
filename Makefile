.PHONY: install dev build start format lint check clean

# Install dependencies
install:
	bun install

# Development server
dev:
	bun run dev

# Production build
build:
	bun run build

# Start production server
start:
	bun run start

# Format code with Biome
format:
	bunx @biomejs/biome format --write .

# Lint code with Biome (auto-fix)
lint:
	bunx @biomejs/biome check --write .

# Run both format and lint
check:
	bunx @biomejs/biome check --write .

# Clean build artifacts
clean:
	rm -rf .next node_modules bun.lockb

# Type check
typecheck:
	bunx tsc --noEmit

# Full validation (format, lint, typecheck)
validate: check typecheck
