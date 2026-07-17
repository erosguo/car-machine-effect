import type { Meta, StoryObj } from '@storybook/react';
import { CarScreen } from '../src/react/components/CarScreen';
import { ScreenEffectsProvider, useScreenEffects } from '../src/react/effects/ScreenEffectsContext';
import { ScreenEffectsLayer } from '../src/react/effects/ScreenEffectsLayer';
import { PRESETS } from '../src/react/effects/presets';
import { useEffect } from 'react';
import '../src/templates';

const meta: Meta<typeof CarScreen> = {
  title: 'Effects/CarScreen with Toolbar',
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

export const WithToolbar: Story = {
  args: {
    model: 'tesla-model-3',
    layers: sampleLayers,
    width: 640,
    showToolbar: true,
  },
};

export const CollapsedToolbar: Story = {
  args: {
    model: 'tesla-model-3',
    layers: sampleLayers,
    width: 640,
    showToolbar: true,
    toolbarCollapsed: true,
  },
};

export const OLEDNightPreset: Story = {
  args: {
    model: 'tesla-model-3',
    layers: sampleLayers,
    width: 640,
    showToolbar: true,
    defaultEffects: PRESETS[0].effects,
  },
};

export const SunnyGlarePreset: Story = {
  args: {
    model: 'byd-seal',
    layers: sampleLayers,
    width: 640,
    showToolbar: true,
    defaultEffects: PRESETS[2].effects,
  },
};

export const LightThemeWithToolbar: Story = {
  args: {
    model: 'xpeng-g9',
    layers: sampleLayers,
    width: 640,
    theme: 'light',
    showToolbar: true,
  },
};

function AutoCycleEffects({ children }: { children: React.ReactNode }) {
  const { updateEffects } = useScreenEffects();
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      updateEffects(PRESETS[i % PRESETS.length].effects);
      i++;
    }, 3000);
    return () => clearInterval(interval);
  }, [updateEffects]);
  return <>{children}</>;
}

export const CyclingPresets: StoryObj = {
  render: () => (
    <ScreenEffectsProvider>
      <AutoCycleEffects>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Presets cycle every 3s (OLED Night → LCD Daylit → Sunny Glare → Overcast)</div>
          <CarScreen model="tesla-model-3" layers={sampleLayers} width={640} showToolbar />
        </div>
      </AutoCycleEffects>
    </ScreenEffectsProvider>
  ),
};
