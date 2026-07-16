import { registerTemplate } from '../core/registry';
import type { CarTemplate } from '../core/types';

const template: CarTemplate = {
  name: 'NIO ET5 / ET7',
  screenWidth: 1728,
  screenHeight: 1888,
  screenRadius: 8,
  accentColor: '#000000',
};

registerTemplate('nio-et5', template);
export default template;
