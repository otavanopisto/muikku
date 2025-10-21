/* eslint-disable @typescript-eslint/no-explicit-any */
// srcv4/src/materials/MaterialLoader/core/processors/FieldProcessor.ts
import * as React from "react";

export type FieldProps = Record<string, any>;
export type FieldComponent = React.ComponentType<FieldProps>;

/**
 * FieldRegistry
 */
export interface FieldRegistry {
  // eslint-disable-next-line jsdoc/require-jsdoc
  get(type: string): FieldComponent | undefined;
  // eslint-disable-next-line jsdoc/require-jsdoc
  register(type: string, comp: FieldComponent): void;
  // eslint-disable-next-line jsdoc/require-jsdoc
  has(type: string): boolean;
  // eslint-disable-next-line jsdoc/require-jsdoc
  entries(): [string, FieldComponent][];
}

/**
 * InMemoryFieldRegistry
 */
export class InMemoryFieldRegistry implements FieldRegistry {
  private map = new Map<string, FieldComponent>();
  /**
   * constructor
   * @param initial initial
   */
  constructor(initial?: Record<string, FieldComponent>) {
    if (initial)
      Object.entries(initial).forEach(([k, v]) => this.map.set(k, v));
  }
  /**
   * get
   * @param type type
   */
  get(type: string) {
    return this.map.get(type);
  }
  /**
   * register
   * @param type type
   */
  register(type: string, comp: FieldComponent) {
    this.map.set(type, comp);
  }
  /**
   * has
   * @param type type
   */
  has(type: string) {
    return this.map.has(type);
  }
  /**
   * entries
   * @param type type
   */
  entries() {
    return Array.from(this.map.entries());
  }
}

/**
 * FieldFactoryConfig
 */
export interface FieldFactoryConfig {
  registry: FieldRegistry;
  onValueChange?: (name: string, value: any) => void; // optional; wired later
  readOnly?: boolean;
}

/**
 * FieldFactory
 */
export class FieldFactory {
  private cfg: FieldFactoryConfig;

  /**
   * constructor
   * @param cfgg cfgg
   */
  constructor(cfgg: FieldFactoryConfig) {
    this.cfg = cfgg;
  }

  /**
   * createField
   * @param type type
   * @param rawParams rawParams
   * @param key key
   */
  createField(type: string | null, rawParams: FieldProps, key?: React.Key) {
    if (!type) return <span key={key}>Invalid field (no type)</span>;

    const Comp = this.cfg.registry.get(type);
    if (!Comp) return <span key={key}>Unsupported field: {type}</span>;

    // normalize params like legacy base/index.tsx
    const params: FieldProps = { ...rawParams };
    params.type ??= "application/json";
    params.content ??= null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    params.readOnly = this.cfg.readOnly ?? params.readOnly;
    if (this.cfg.onValueChange) {
      params.onChange = (ctx: any, name: string, value: any) =>
        this.cfg.onValueChange?.(name, value);
    }

    return <Comp key={key} {...params} />;
  }
}
