export function SmallHouse() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 壁 - 右面 */}
      <polygon points="50,85 85,67.5 85,42.5 50,60" fill="#d6c1ac" />
      {/* 壁 - 左面 */}
      <polygon points="50,85 15,67.5 15,42.5 50,60" fill="#fdf0e3" />
      {/* 屋根 - 右面 */}
      <polygon points="50,60 85,42.5 50,20" fill="#e6695b" />
      {/* 屋根 - 左面 */}
      <polygon points="50,60 15,42.5 50,20" fill="#ff8ba7" />
      {/* ドア */}
      <polygon points="42,85 42,72 50,68 50,81" fill="#272343" />
      {/* 窓 */}
      <polygon points="25,55 35,50 35,58 25,63" fill="#a8edea" opacity="0.8" />
    </svg>
  );
}
