import type { CarTemplate } from './types';
import { validateTemplate } from './utils';

const registry = new Map<string, CarTemplate>();

export function registerTemplate(name: string, template: CarTemplate): string {
  if (!validateTemplate(template)) {
    throw new Error(`Invalid template: ${name}`);
  }
  registry.set(name, template);
  return name;
}

export function getTemplate(name: string): CarTemplate | null {
  return registry.get(name) ?? null;
}

export function getAllTemplates(): CarTemplate[] {
  return Array.from(registry.values());
}

export function clearRegistry(): void {
  registry.clear();
}
