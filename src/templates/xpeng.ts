import { registerTemplate } from '../core/registry';
import type { CarTemplate } from '../core/types';

const template: CarTemplate = {
  name: 'XPeng G9 / P7i',
  screenWidth: 2400,
  screenHeight: 1200,
  screenRadius: 16,
  accentColor: '#5C3CFA',
};

registerTemplate('xpeng-g9', template);
export default template;
