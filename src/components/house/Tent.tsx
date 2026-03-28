export function Tent() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* テント本体 - 左面 */}
      <polygon points="10,65 50,85 50,35" fill="#bae8e8" />
      {/* テント本体 - 右面 */}
      <polygon points="90,65 50,85 50,35" fill="#7bc1c1" />
      {/* 入り口 */}
      <polygon points="50,85 40,75 60,75" fill="#272343" />
    </svg>
  );
}
