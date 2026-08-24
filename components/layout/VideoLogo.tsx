import Link from "next/link";

export function VideoLogo() {
  return (
    <Link
      href="/"
      aria-label="BOB — на головну"
      className="block h-24 w-24 overflow-hidden"
    >
      <video
        src="/video/frombobwithlove-logo-anim.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
