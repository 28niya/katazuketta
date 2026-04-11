import { notFound } from 'next/navigation';
import { IS_DEV, DEFAULT_AREAS, AREA_COLORS } from '@/types';
import { AREA_ICONS } from '@/lib/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { AreaIcon, GradientIcon } from '@/components/ui/AreaIcon';

export default function PresetsDemoPage() {
  if (!IS_DEV) notFound();

  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <header>
          <h1 className="text-2xl font-bold mb-2">プリセット確認</h1>
          <p className="text-sm text-sub">
            DEFAULT_AREAS / AREA_COLORS / AREA_ICONS の視覚確認用
          </p>
        </header>

        {/* カラーパレット */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">AREA_COLORS ({AREA_COLORS.length}色)</h2>
          <GlassCard>
            <div className="grid grid-cols-6 gap-3">
              {AREA_COLORS.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-14 h-14 rounded-2xl shadow-sm"
                    style={{ background: color.css }}
                  />
                  <span className="text-[10px] text-sub font-mono">{i}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* デフォルトエリア */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">DEFAULT_AREAS ({DEFAULT_AREAS.length}個)</h2>
          <GlassCard>
            <div className="grid grid-cols-3 gap-5">
              {DEFAULT_AREAS.map((area) => (
                <div key={area.name} className="flex flex-col items-center gap-2">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: AREA_COLORS[area.colorIndex].activeBg, border: `1px solid ${AREA_COLORS[area.colorIndex].activeBorder}` }}
                  >
                    <AreaIcon iconName={area.iconName} colorIndex={area.colorIndex} size={40} stroke={1.5} />
                  </div>
                  <span className="text-sm font-bold">{area.name}</span>
                  <span className="text-[10px] text-sub font-mono">
                    {area.iconName} / c{area.colorIndex}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* 使えるアイコン一覧 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">AREA_ICONS ({AREA_ICONS.length}個)</h2>
          <p className="text-xs text-sub">選択可能アイコン。色は index 0 (青) で固定表示</p>
          <GlassCard>
            <div className="grid grid-cols-4 gap-5">
              {AREA_ICONS.map((icon) => (
                <div key={icon.name} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/40 border border-white/70">
                    <GradientIcon icon={icon.Icon} colorIndex={0} size={32} stroke={1.5} />
                  </div>
                  <span className="text-xs font-bold">{icon.label}</span>
                  <span className="text-[10px] text-sub font-mono break-all text-center">{icon.name}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
