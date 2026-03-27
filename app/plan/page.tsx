export default function TanningBedPlan() {
  // Scale: 1cm = 3px for top/side views
  const S = 3;

  // ── TOP VIEW ──────────────────────────────────────────────────────────────
  // Overall: 170 × 85 cm  → 510 × 255 px
  const TW = 170 * S; // 510
  const TH = 85 * S;  // 255
  const railW = 4 * S; // rail thickness 4cm
  const slats = 14;
  const slatW = 9 * S;  // 9 cm wide
  const innerW = TW - 2 * railW; // space between side rails
  const totalSlatsW = slats * slatW;
  const totalGaps = innerW - totalSlatsW;
  const gap = totalGaps / (slats - 1);
  const hingeX = 110 * S; // hinge at 110cm from foot

  // ── SIDE VIEW ─────────────────────────────────────────────────────────────
  const legH = 15 * S; // 15cm legs
  const frameH = 4 * S;
  const slatThick = 2.5 * S;
  const sideW = TW;
  const sideH = (legH + frameH + slatThick + 10) * 1; // total svg height

  // Adjustable backrest angle (30°)
  const angleRad = (30 * Math.PI) / 180;
  const bkLen = 60 * S; // 60cm backrest
  const bkX1 = hingeX;
  const bkY1 = legH + frameH; // top of frame at hinge
  const bkX2 = bkX1 - Math.cos(angleRad) * bkLen;
  const bkY2 = bkY1 - Math.sin(angleRad) * bkLen;
  // prop: from midpoint of backrest down to frame
  const propX1 = (bkX1 + bkX2) / 2;
  const propY1 = (bkY1 + bkY2) / 2;
  const propY2 = legH + frameH;
  const propX2 = propX1 + (propY2 - propY1) / Math.tan(angleRad);

  const PAD = 60; // padding around drawings for labels

  return (
    <div className="min-h-screen bg-stone-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">
          Tanning Bed — Build Plan
        </h1>
        <p className="text-stone-500 mb-8 text-sm">
          170 × 85 cm · Recycled bunk-bed pine · All dimensions in cm
        </p>

        {/* ── TOP VIEW ──────────────────────────────────────────── */}
        <Section title="1 — Top View (Plan)">
          <svg
            viewBox={`0 0 ${TW + PAD * 2} ${TH + PAD * 2}`}
            className="w-full border border-stone-200 rounded-xl bg-white"
          >
            <g transform={`translate(${PAD},${PAD})`}>
              {/* Outer frame */}
              <rect x={0} y={0} width={TW} height={TH} fill="#e8d5b0" stroke="#5a3e1b" strokeWidth={1.5} />

              {/* Inner cutout (open space between rails + end rails) */}
              <rect
                x={railW} y={railW}
                width={TW - 2 * railW} height={TH - 2 * railW}
                fill="#f5f0e8" stroke="none"
              />

              {/* End rails (top & bottom of plan = head & foot) */}
              <rect x={0} y={0} width={railW} height={TH} fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1} />
              <rect x={TW - railW} y={0} width={railW} height={TH} fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1} />

              {/* Slats */}
              {Array.from({ length: slats }).map((_, i) => {
                const x = railW + i * (slatW + gap);
                return (
                  <rect
                    key={i}
                    x={x} y={railW}
                    width={slatW} height={TH - 2 * railW}
                    fill="#ddc48a" stroke="#5a3e1b" strokeWidth={0.8}
                  />
                );
              })}

              {/* Hinge line */}
              <line
                x1={hingeX} y1={0}
                x2={hingeX} y2={TH}
                stroke="#c0392b" strokeWidth={2} strokeDasharray="8,4"
              />

              {/* Leg positions (filled circles at corners) */}
              {[[railW / 2, railW / 2], [railW / 2, TH - railW / 2],
                [TW - railW / 2, railW / 2], [TW - railW / 2, TH - railW / 2]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r={8} fill="#5a3e1b" />
              ))}

              {/* ── Dimension lines ── */}
              {/* Total width 170cm */}
              <DimLine x1={0} y1={-20} x2={TW} y2={-20} label="170 cm" />
              {/* Total depth 85cm */}
              <DimLine x1={TW + 20} y1={0} x2={TW + 20} y2={TH} label="85 cm" vertical />
              {/* Fixed section 110cm */}
              <DimLine x1={hingeX} y1={TH + 20} x2={TW} y2={TH + 20} label="110 cm (fixed)" />
              {/* Backrest 60cm */}
              <DimLine x1={0} y1={TH + 20} x2={hingeX} y2={TH + 20} label="60 cm (backrest)" />
              {/* Rail width */}
              <DimLine x1={TW - railW} y1={TH / 2} x2={TW} y2={TH / 2} label="4 cm" />

              {/* Labels */}
              <Label x={hingeX / 2 + (TW - hingeX) / 2 + hingeX / 2} y={TH / 2 - 10} text="FIXED BASE" />
              <Label x={hingeX / 2} y={TH / 2 - 10} text="BACKREST" />
              <SmallLabel x={hingeX + 8} y={20} text="HINGE LINE" color="#c0392b" />
              <SmallLabel x={6} y={TH / 2} text="● LEG" />
            </g>
          </svg>
          <Legend items={[
            { color: "#c9a96e", label: "Side & end rails — 4 × 4 cm" },
            { color: "#ddc48a", label: "Slats — 9 × 2.5 cm (×14)" },
            { color: "#5a3e1b", label: "Leg positions (×4)" },
            { color: "#c0392b", label: "Hinge line at 110 cm", dashed: true },
          ]} />
        </Section>

        {/* ── SIDE VIEW ─────────────────────────────────────────── */}
        <Section title="2 — Side View (Profile)">
          <svg
            viewBox={`0 0 ${sideW + PAD * 2} ${120 + PAD * 2}`}
            className="w-full border border-stone-200 rounded-xl bg-white"
          >
            <g transform={`translate(${PAD},${PAD + 20})`}>
              {/* Ground line */}
              <line x1={-10} y1={legH + frameH + slatThick} x2={sideW + 10} y2={legH + frameH + slatThick}
                stroke="#bbb" strokeWidth={1} strokeDasharray="4,3" />

              {/* Legs */}
              {[railW / 2, hingeX, sideW - railW / 2].map((lx, i) => (
                <rect key={i}
                  x={lx - 6} y={frameH + slatThick}
                  width={12} height={legH}
                  fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1}
                />
              ))}

              {/* Fixed base frame */}
              <rect
                x={hingeX} y={slatThick}
                width={sideW - hingeX} height={frameH}
                fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1.5}
              />
              {/* Fixed base slats (side silhouette) */}
              <rect
                x={hingeX} y={0}
                width={sideW - hingeX} height={slatThick}
                fill="#ddc48a" stroke="#5a3e1b" strokeWidth={1}
              />

              {/* Adjustable backrest (angled) */}
              {/* Frame board of backrest */}
              <line
                x1={bkX1} y1={bkY1 - frameH}
                x2={bkX2} y2={bkY2 - frameH}
                stroke="#5a3e1b" strokeWidth={frameH}
                strokeLinecap="round"
              />
              {/* Slat surface of backrest */}
              <line
                x1={bkX1} y1={bkY1 - frameH - slatThick}
                x2={bkX2} y2={bkY2 - frameH - slatThick}
                stroke="#ddc48a" strokeWidth={slatThick}
                strokeLinecap="round"
              />

              {/* Prop support */}
              <line
                x1={propX1} y1={propY1 - frameH}
                x2={propX2} y2={propY2}
                stroke="#5a3e1b" strokeWidth={3}
                strokeLinecap="round"
              />

              {/* Hinge dot */}
              <circle cx={hingeX} cy={bkY1 - frameH / 2} r={5} fill="#c0392b" />

              {/* Angle arc */}
              <path
                d={describeArc(hingeX, bkY1 - frameH, 35, -180, -180 + 30)}
                fill="none" stroke="#c0392b" strokeWidth={1.5}
              />

              {/* Dimension: total length */}
              <DimLine x1={0} y1={-25} x2={sideW} y2={-25} label="170 cm" />
              {/* Leg height */}
              <DimLine x1={sideW + 25} y1={frameH + slatThick} x2={sideW + 25} y2={legH + frameH + slatThick} label="15 cm" vertical />
              {/* Frame height */}
              <DimLine x1={sideW + 25} y1={slatThick} x2={sideW + 25} y2={frameH + slatThick} label="4 cm" vertical />

              {/* Angle label */}
              <text x={hingeX - 65} y={bkY1 - frameH - 10} fontSize={11} fill="#c0392b" fontWeight="bold">30°</text>

              {/* Labels */}
              <SmallLabel x={hingeX + (sideW - hingeX) / 2} y={-8} text="FIXED BASE (110 cm)" />
              <SmallLabel x={hingeX / 2} y={bkY2 - frameH - 16} text="BACKREST (60 cm)" />
              <SmallLabel x={propX2 + 5} y={propY2 - 8} text="PROP" />
            </g>
          </svg>
        </Section>

        {/* ── FRONT VIEW ────────────────────────────────────────── */}
        <Section title="3 — Front View (Foot End)">
          <svg
            viewBox={`0 0 ${TH + PAD * 2} ${120 + PAD * 1.5}`}
            className="w-full max-w-sm border border-stone-200 rounded-xl bg-white"
          >
            <g transform={`translate(${PAD},${PAD + 10})`}>
              {/* Ground */}
              <line x1={-10} y1={legH + frameH + slatThick} x2={TH + 10} y2={legH + frameH + slatThick}
                stroke="#bbb" strokeWidth={1} strokeDasharray="4,3" />

              {/* Two legs */}
              {[railW / 2, TH - railW / 2].map((lx, i) => (
                <rect key={i}
                  x={lx - 6} y={frameH + slatThick}
                  width={12} height={legH}
                  fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1}
                />
              ))}

              {/* End rail (foot end) */}
              <rect x={0} y={slatThick} width={TH} height={frameH}
                fill="#c9a96e" stroke="#5a3e1b" strokeWidth={1.5} />

              {/* Slats (seen end-on as thin lines) */}
              {Array.from({ length: slats }).map((_, i) => {
                const x = railW + i * (slatW + gap);
                return (
                  <rect key={i} x={x} y={0} width={slatW} height={slatThick}
                    fill="#ddc48a" stroke="#5a3e1b" strokeWidth={0.8} />
                );
              })}

              {/* Width dimension */}
              <DimLine x1={0} y1={-20} x2={TH} y2={-20} label="85 cm" />
              {/* Leg height */}
              <DimLine x1={TH + 20} y1={frameH + slatThick} x2={TH + 20} y2={legH + frameH + slatThick} label="15 cm" vertical />
            </g>
          </svg>
        </Section>

        {/* ── CUT LIST ──────────────────────────────────────────── */}
        <Section title="4 — Cut List">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-stone-800 text-white">
                  {["Part", "Qty", "Length", "Width", "Thickness", "Source"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Side rails", "2", "170 cm", "8 cm", "4 cm", "Long bed-frame boards"],
                  ["End rails", "2", "85 cm", "8 cm", "4 cm", "Short frame pieces"],
                  ["Legs", "4", "15 cm", "8 cm", "8 cm", "Stair risers / thick offcuts"],
                  ["Slats", "14", "85 cm", "9 cm", "2.5 cm", "Existing bed slats"],
                  ["Backrest prop", "1", "40 cm", "4 cm", "4 cm", "Any leftover piece"],
                  ["Hinge blocks", "2", "8 cm", "8 cm", "4 cm", "Offcuts"],
                ].map(([part, qty, l, w, t, src], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-amber-50" : "bg-white"}>
                    <td className="px-4 py-2 font-medium text-stone-800">{part}</td>
                    <td className="px-4 py-2 text-center">{qty}</td>
                    <td className="px-4 py-2">{l}</td>
                    <td className="px-4 py-2">{w}</td>
                    <td className="px-4 py-2">{t}</td>
                    <td className="px-4 py-2 text-stone-500 text-xs">{src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── ASSEMBLY ORDER ────────────────────────────────────── */}
        <Section title="5 — Assembly Order">
          <ol className="space-y-3">
            {[
              "Cut side rails to 170 cm from long bed-frame boards",
              "Attach end rails at both ends with 2 screws each → forms outer rectangle",
              "Screw legs flush to four corners (15 cm down)",
              "Mark hinge point at 110 cm from the foot end on both side rails",
              "Lay & screw 8 slats on the fixed section, 6 slats on the backrest section",
              "Bolt backrest section to fixed section at hinge point (reuse barn-door hinges)",
              "Cut 3 notches in foot end-rail at ~100°, 120°, 140° for the prop",
              "Sand & oil all surfaces",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-stone-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-stone-700 mb-3 border-b border-stone-200 pb-1">{title}</h2>
      {children}
    </div>
  );
}

function DimLine({
  x1, y1, x2, y2, label, vertical = false,
}: {
  x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#374151" strokeWidth={1} markerStart="url(#arr)" markerEnd="url(#arr)" />
      <line x1={x1} y1={y1} x2={vertical ? x1 : x1} y2={vertical ? y1 : y1} stroke="#374151" strokeWidth={0.5} strokeDasharray="3,2" />
      <text
        x={vertical ? mx - 28 : mx}
        y={vertical ? my : my - 5}
        fontSize={10}
        fill="#1f2937"
        textAnchor="middle"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}

function Label({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text x={x} y={y} fontSize={11} fill="#374151" textAnchor="middle" fontWeight="700" opacity={0.5}>
      {text}
    </text>
  );
}

function SmallLabel({ x, y, text, color = "#374151" }: { x: number; y: number; text: string; color?: string }) {
  return (
    <text x={x} y={y} fontSize={9} fill={color} textAnchor="middle" fontWeight="600">
      {text}
    </text>
  );
}

function Legend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-4 mt-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
          <span
            className="inline-block w-5 h-3 rounded-sm border border-stone-400"
            style={{
              background: item.dashed ? "transparent" : item.color,
              borderStyle: item.dashed ? "dashed" : "solid",
              borderColor: item.color,
              borderWidth: 2,
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
