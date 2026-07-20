/**
 * LeafLogo — Vardaan+ brand mark
 * A stylized green leaf with a soft gradient and central vein,
 * inspired by the app's healing/growth theme.
 */
export default function LeafLogo({ className = "", size = 24, gradient = true }) {
  const gradId = "leaf-lg-gradient";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vardaan+"
    >
      {gradient && (
        <defs>
          <linearGradient id={gradId} x1="20%" y1="10%" x2="80%" y2="95%">
            <stop offset="0%" stopColor="#86D850" />
            <stop offset="55%" stopColor="#3AAF3D" />
            <stop offset="100%" stopColor="#1B7F2A" />
          </linearGradient>
        </defs>
      )}
      {/* Leaf body — pointed tip at top-right, stem at bottom-left */}
      <path
        d="M4.6 20.4 C 3.6 18.4, 1.6 12.6, 5.8 7.4 C 9.8 2.6, 17 1.6, 20.4 4.6 C 22.4 10.4, 19.6 18.4, 12.4 20.8 C 9.6 21.6, 6.4 21.6, 4.6 20.4 Z"
        fill={gradient ? `url(#${gradId})` : "currentColor"}
      />
      {/* Central vein — curves from stem to tip */}
      <path
        d="M5.2 20.6 Q 11.4 12.8, 20.2 4.6"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
    </svg>
  );
}
