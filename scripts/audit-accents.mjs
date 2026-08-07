// Прогон контраст-аудита по всем шести пресетам × двум темам.
// Запуск: node scripts/audit-accents.mjs
// Значения должны совпадать с [data-accent] блоками в src/styles/tailwind.css —
// если тронул палитру, прогони это и убедись, что все пары держат AA.
import { audit } from "./audit-accent.mjs";

const LIGHT = { bg: [0, 0, 100], fg: [0, 0, 11.4], softPct: 0.12, accentFg: [0, 0, 100] };
let ok = true;
const run = (n, p) => (ok = audit(n, p) && ok);

run("green light", { ...LIGHT, accent: [142, 66, 32], vivid: [142, 76, 36] });
run("blue light", { ...LIGHT, accent: [217, 79, 45], vivid: [217, 88, 44] });
run("violet light", { ...LIGHT, accent: [263, 60, 50], vivid: [263, 75, 50] });
run("red light", { ...LIGHT, accent: [0, 72, 52.5], vivid: [0, 80, 56.5] });
run("orange light", { ...LIGHT, accent: [25, 88, 39.5], vivid: [25, 96, 43.5] });
run("pink light", { ...LIGHT, accent: [335, 72, 50.5], vivid: [335, 80, 54.5] });

run("green dark", { bg: [0, 0, 7], fg: [0, 0, 95], softPct: 0.18, accent: [142, 58, 52], accentFg: [0, 0, 7], vivid: [142, 62, 52], subtleFg: [0, 0, 63], subtle: [0, 0, 21], surface: [0, 0, 15] });
run("blue dark", { bg: [0, 0, 0], fg: [0, 0, 100], softPct: 0.18, accent: [213, 90, 66], accentFg: [0, 0, 0], vivid: [213, 90, 64], subtleFg: [0, 0, 69], subtle: [0, 0, 16], surface: [0, 0, 8] });
run("violet dark", { bg: [0, 0, 0], fg: [0, 0, 93], softPct: 0.18, accent: [263, 85, 72], accentFg: [0, 0, 0], vivid: [263, 82, 70], subtleFg: [0, 0, 58], subtle: [0, 0, 16], surface: [0, 0, 4] });
run("red dark", { bg: [0, 0, 4], fg: [0, 0, 96], softPct: 0.18, accent: [0, 80, 67.5], accentFg: [0, 0, 4], vivid: [0, 85, 67], subtleFg: [0, 0, 60], subtle: [0, 0, 19], surface: [0, 0, 12] });
run("orange dark", { bg: [0, 0, 11], fg: [0, 0, 92], softPct: 0.18, accent: [30, 90, 51.5], accentFg: [0, 0, 11], vivid: [30, 95, 52], subtleFg: [0, 0, 68], subtle: [0, 0, 25], surface: [0, 0, 20] });
run("pink dark", { bg: [0, 0, 6], fg: [0, 0, 94], softPct: 0.18, accent: [335, 85, 67.5], accentFg: [0, 0, 6], vivid: [335, 88, 67], subtleFg: [0, 0, 63], subtle: [0, 0, 21], surface: [0, 0, 15] });

console.log(ok ? "\n✅ Все 12 пар проходят" : "\n❌ Есть провалы");
process.exit(ok ? 0 : 1);
