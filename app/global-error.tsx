"use client";

// Only rendered if the root layout itself throws — everything else (fonts,
// globals.css, MotionProvider, Header/Footer) lives inside that layout, so
// this file can't rely on any of it and has to bring its own <html>/<body>
// with plain inline styles. See app/error.tsx for the normal case.
export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="uk">
      <body
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
          background: "#ffffff",
          color: "#0a0a0a",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          Щось пішло не так
        </p>
        <p
          style={{
            marginTop: 8,
            maxWidth: 360,
            fontSize: 14,
            color: "#6b6b6b",
          }}
        >
          Сталася непередбачена помилка. Спробуйте перезавантажити сторінку.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: 32,
            border: "1px solid #0a0a0a",
            padding: "12px 24px",
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Спробувати ще раз
        </button>
      </body>
    </html>
  );
}
