import { registerTemplate } from '../core/registry';
import type { CarTemplate } from '../core/types';

const template: CarTemplate = {
  name: 'Tesla Model 3 / Y',
  screenWidth: 1920,
  screenHeight: 1080,
  screenRadius: 10,
  accentColor: '#E82127',
};

registerTemplate('tesla-model-3', template);
export default template;
