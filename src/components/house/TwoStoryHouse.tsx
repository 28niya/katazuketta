export function TwoStoryHouse() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* 1F壁 - 右面 */}
      <polygon points="50,90 90,70 90,45 50,65" fill="#e6d9ce" />
      {/* 1F壁 - 左面 */}
      <polygon points="50,90 10,70 10,45 50,65" fill="#ffffff" />
      {/* 2F壁 - 右面 */}
      <polygon points="50,65 80,50 80,30 50,45" fill="#d6c1ac" />
      {/* 2F壁 - 左面 */}
      <polygon points="50,65 20,50 20,30 50,45" fill="#fdf0e3" />
      {/* 屋根 - 右面 */}
      <polygon points="50,45 80,30 50,10" fill="#209869" />
      {/* 屋根 - 左面 */}
      <polygon points="50,45 20,30 50,10" fill="#2cb67d" />
      {/* ドア */}
      <polygon points="43,90 43,78 50,74 50,86" fill="#272343" />
      {/* 1F窓 */}
      <polygon points="18,58 28,53 28,60 18,65" fill="#a8edea" opacity="0.8" />
      {/* 2F窓 */}
      <polygon points="28,42 38,37 38,44 28,49" fill="#a8edea" opacity="0.8" />
      {/* 2F窓右 */}
      <polygon points="58,42 68,37 68,44 58,39" fill="#a8edea" opacity="0.6" />
    </svg>
  );
}
