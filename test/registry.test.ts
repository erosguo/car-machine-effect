import { describe, it, expect, beforeEach } from 'vitest';
import { registerTemplate, getTemplate, getAllTemplates, clearRegistry } from '../src/core/registry';
import type { CarTemplate } from '../src/core/types';

const mockTemplate: CarTemplate = {
  name: 'mock-car',
  screenWidth: 1920,
  screenHeight: 1080,
  screenRadius: 10,
};

describe('registry', () => {
  beforeEach(() => {
    clearRegistry();
  });

  it('should register and retrieve a template', () => {
    registerTemplate('mock-car', mockTemplate);
    const result = getTemplate('mock-car');
    expect(result).toEqual(mockTemplate);
  });

  it('should return null for unknown template', () => {
    expect(getTemplate('non-existent')).toBeNull();
  });

  it('should list all registered templates', () => {
    registerTemplate('car-a', mockTemplate);
    registerTemplate('car-b', { ...mockTemplate, name: 'car-b' });
    const all = getAllTemplates();
    expect(all).toHaveLength(2);
  });
});
