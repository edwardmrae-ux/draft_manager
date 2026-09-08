"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_POSITION_COLORS,
  POSITION_COLOR_STORAGE_KEY,
  parseStoredColors,
  type PositionColors,
} from "@/lib/positionColors";
import type { Position } from "@/lib/types";

type PositionColorContextValue = {
  colors: PositionColors;
  setColor: (position: Position, hex: string) => void;
  resetDefaults: () => void;
};

const PositionColorContext = createContext<PositionColorContextValue | null>(
  null,
);

const listeners = new Set<() => void>();
let cachedColors: PositionColors | null = null;

function emitChange() {
  cachedColors = null;
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function readFromStorage(): PositionColors {
  try {
    return parseStoredColors(localStorage.getItem(POSITION_COLOR_STORAGE_KEY));
  } catch {
    return DEFAULT_POSITION_COLORS;
  }
}

function getSnapshot(): PositionColors {
  if (!cachedColors) {
    cachedColors = readFromStorage();
  }
  return cachedColors;
}

function getServerSnapshot(): PositionColors {
  return DEFAULT_POSITION_COLORS;
}

function writeColors(colors: PositionColors) {
  try {
    localStorage.setItem(POSITION_COLOR_STORAGE_KEY, JSON.stringify(colors));
  } catch {
    // Ignore quota / private-mode failures; UI still updates in memory.
  }
  cachedColors = colors;
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === POSITION_COLOR_STORAGE_KEY || event.key === null) {
      emitChange();
    }
  });
}

export function PositionColorProvider({ children }: { children: ReactNode }) {
  const colors = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setColor = useCallback((position: Position, hex: string) => {
    writeColors({ ...getSnapshot(), [position]: hex });
  }, []);

  const resetDefaults = useCallback(() => {
    try {
      localStorage.removeItem(POSITION_COLOR_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
    cachedColors = DEFAULT_POSITION_COLORS;
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ colors, setColor, resetDefaults }),
    [colors, setColor, resetDefaults],
  );

  return (
    <PositionColorContext.Provider value={value}>
      {children}
    </PositionColorContext.Provider>
  );
}

export function usePositionColors() {
  const context = useContext(PositionColorContext);
  if (!context) {
    throw new Error(
      "usePositionColors must be used within a PositionColorProvider",
    );
  }
  return context;
}
