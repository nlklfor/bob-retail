import { mock } from "bun:test";

// Source files import "server-only" to fail the build if bundled into a
// Client Component. That package throws unconditionally outside Next's own
// "react-server" bundler condition, which bun test doesn't set — so tests
// never actually exercise the client/server boundary, only the logic below
// it, and this stub just keeps the import from crashing every test file.
mock.module("server-only", () => ({}));
