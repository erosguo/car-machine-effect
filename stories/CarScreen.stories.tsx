import type { Meta, StoryObj } from '@storybook/react';
import { CarScreen } from '../src/react/components/CarScreen';
import '../src/templates';

const meta: Meta<typeof CarScreen> = {
  title: 'CarScreen',
  component: CarScreen,
  argTypes: {
    model: {
      control: 'select',
      options: ['byd-seal', 'nio-et5', 'xpeng-g9', 'li-l9', 'tesla-model-3'],
    },
    width: { control: { type: 'range', min: 320, max: 1200, step: 10 } },
    theme: { control: 'radio', options: ['dark', 'light'] },
  },
};

export default meta;

type Story = StoryObj<typeof CarScreen>;

const sampleLayers = [
  { src: 'https://placehold.co/1920x1080/1a1a2e/e94560?text=BG', zIndex: 0, alt: 'background' },
  { src: 'https://placehold.co/1920x1080/16213e/0f3460?text=Overlay', zIndex: 1, alt: 'overlay' },
];

export const TeslaModel3: Story = {
  args: {
    model: 'tesla-model-3',
    layers: sampleLayers,
    width: 640,
  },
};

export const BYDSeal: Story = {
  args: {
    model: 'byd-seal',
    layers: sampleLayers,
    width: 640,
  },
};

export const NIOET5: Story = {
  args: {
    model: 'nio-et5',
    layers: [
      { src: 'https://placehold.co/1728x1888/000000/ffffff?text=NIO+Screen', zIndex: 0, alt: 'nio screen' },
    ],
    width: 400,
  },
};

export const AllTemplates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {['byd-seal', 'nio-et5', 'xpeng-g9', 'li-l9', 'tesla-model-3'].map((m) => (
        <CarScreen key={m} model={m} layers={sampleLayers} width={320} />
      ))}
    </div>
  ),
};

export const UnknownModel: Story = {
  args: {
    model: 'not-a-car',
    layers: [],
    width: 640,
  },
};

export const CustomTemplate: Story = {
  args: {
    model: {
      name: 'Custom 800x600',
      screenWidth: 800,
      screenHeight: 600,
      screenRadius: 4,
      accentColor: '#00ff00',
    },
    layers: [
      { src: 'https://placehold.co/800x600/2d2d2d/ffffff?text=Custom', zIndex: 0, alt: 'custom' },
    ],
    width: 480,
  },
};
