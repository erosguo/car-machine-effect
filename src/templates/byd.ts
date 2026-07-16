import { registerTemplate } from '../core/registry';
import type { CarTemplate } from '../core/types';

const template: CarTemplate = {
  name: 'BYD Seal / Han',
  screenWidth: 1920,
  screenHeight: 1080,
  screenRadius: 12,
  accentColor: '#4A90D9',
};

registerTemplate('byd-seal', template);
export default template;
