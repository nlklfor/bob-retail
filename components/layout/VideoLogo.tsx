import Link from "next/link";

export function VideoLogo() {
  return (
    <Link
      href="/"
      aria-label="BOB — на головну"
      className="block h-20 w-20 overflow-hidden"
    >
      <video
        src="/video/bob_logo_anim.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
