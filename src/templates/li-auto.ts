import { registerTemplate } from '../core/registry';
import type { CarTemplate } from '../core/types';

const template: CarTemplate = {
  name: 'Li Auto L9 / L8',
  screenWidth: 2880,
  screenHeight: 1600,
  screenRadius: 20,
  accentColor: '#00A3FF',
};

registerTemplate('li-l9', template);
export default template;
