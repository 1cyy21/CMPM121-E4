import { WIDTH } from "./actors.ts";

export type EnemyKind = "drone" | "dart" | "turret" | "lancer";

/**
 * line: side by side, all at once
 * vee: side by side, the middle first
 * column: one after another at the same x
 * pincer: pairs from the left and right edges, row by row
 */
export type Formation = "line" | "vee" | "column" | "pincer";

export interface Wave {
  at: number;
  kind: EnemyKind;
  count: number;
  formation: Formation;
  /** Center of a line or vee, or the x of a column. Defaults to mid-screen. */
  x?: number;
}

export interface Sector {
  name: string;
  subtitle: string;
  /** Ticks before the sector may end once its enemies are gone. */
  length: number;
  waves: Wave[];
}

/** Ticks after length when the next sector starts even if enemies remain. */
export const OVERTIME = 240;

export const BOSS_NAME = "The Warden";

export const SECTORS: Sector[] = [
  {
    name: "Outer Drift",
    subtitle: "Scouts ahead",
    length: 1560,
    waves: [
      { at: 60, kind: "drone", count: 4, formation: "line" },
      { at: 360, kind: "drone", count: 5, formation: "vee", x: 168 },
      { at: 660, kind: "drone", count: 5, formation: "vee", x: 312 },
      { at: 960, kind: "drone", count: 6, formation: "line" },
      { at: 1200, kind: "drone", count: 4, formation: "column", x: 120 },
      { at: 1260, kind: "drone", count: 4, formation: "column", x: 360 },
    ],
  },
  {
    name: "Shatter Belt",
    subtitle: "Divers incoming",
    length: 1800,
    waves: [
      { at: 60, kind: "drone", count: 6, formation: "vee" },
      { at: 300, kind: "dart", count: 4, formation: "line" },
      { at: 600, kind: "dart", count: 5, formation: "column", x: 144 },
      { at: 720, kind: "dart", count: 5, formation: "column", x: 336 },
      { at: 1020, kind: "drone", count: 7, formation: "line" },
      { at: 1140, kind: "dart", count: 5, formation: "vee" },
      { at: 1440, kind: "dart", count: 6, formation: "line" },
    ],
  },
  {
    name: "Gun Lanes",
    subtitle: "Turrets online",
    length: 1920,
    waves: [
      { at: 60, kind: "turret", count: 1, formation: "line" },
      { at: 240, kind: "drone", count: 6, formation: "vee" },
      { at: 540, kind: "turret", count: 2, formation: "line" },
      { at: 840, kind: "dart", count: 6, formation: "column" },
      { at: 1080, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "drone", count: 6, formation: "line" },
      { at: 1500, kind: "turret", count: 3, formation: "line" },
    ],
  },
  {
    name: "Lancer Gate",
    subtitle: "Crossfire",
    length: 1920,
    waves: [
      { at: 60, kind: "lancer", count: 4, formation: "pincer" },
      { at: 360, kind: "dart", count: 6, formation: "vee" },
      { at: 600, kind: "lancer", count: 6, formation: "pincer" },
      { at: 780, kind: "turret", count: 2, formation: "line" },
      { at: 1140, kind: "lancer", count: 6, formation: "pincer" },
      { at: 1260, kind: "drone", count: 8, formation: "vee" },
      { at: 1560, kind: "dart", count: 8, formation: "line" },
    ],
  },
  {
    name: "Last Approach",
    subtitle: "Everything they have",
    length: 2040,
    waves: [
      { at: 60, kind: "turret", count: 3, formation: "line" },
      { at: 180, kind: "lancer", count: 6, formation: "pincer" },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 120 },
      { at: 540, kind: "dart", count: 6, formation: "column", x: 360 },
      { at: 900, kind: "drone", count: 9, formation: "vee" },
      { at: 1020, kind: "turret", count: 2, formation: "line" },
      { at: 1320, kind: "lancer", count: 8, formation: "pincer" },
      { at: 1560, kind: "dart", count: 8, formation: "vee" },
    ],
  },
];

/** Every stop on the route: the sectors, then the Warden. */
export const ROUTE = [...SECTORS.map((sector) => sector.name), BOSS_NAME];

export interface Placement {
  at: number;
  x: number;
  y: number;
  side: number;
}

/** Where and when each enemy of a wave appears, in creation order. */
export function placements(wave: Wave): Placement[] {
  const mid = (wave.count - 1) / 2;
  const x = wave.x ?? WIDTH / 2;
  return Array.from({ length: wave.count }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    switch (wave.formation) {
      case "line":
        return { at: wave.at, x: x + (i - mid) * 64, y: -30, side };
      case "vee":
        return {
          at: wave.at + Math.abs(i - mid) * 10,
          x: x + (i - mid) * 44,
          y: -30,
          side,
        };
      case "column":
        return { at: wave.at + i * 24, x, y: -30, side };
      case "pincer": {
        const row = Math.floor(i / 2);
        return {
          at: wave.at + row * 30,
          x: i % 2 === 0 ? -30 : WIDTH + 30,
          y: 70 + row * 50,
          side,
        };
      }
    }
  });
}
