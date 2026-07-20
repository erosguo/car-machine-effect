import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhotoWall } from '../src/react/components/PhotoWall';
import type { PhotoWallItem } from '../src/react/components/PhotoWall';
import '../src/templates';

const meta: Meta<typeof PhotoWall> = {
  title: 'PhotoWall',
  component: PhotoWall,
};

export default meta;

type Story = StoryObj<typeof PhotoWall>;

function InteractivePhotoWall({ initial = [], multiple = false, carPreview = true, showToolbar = false }: {
  initial?: PhotoWallItem[]; multiple?: boolean; carPreview?: boolean; showToolbar?: boolean;
}) {
  const [files, setFiles] = useState<PhotoWallItem[]>(initial);
  return (
    <PhotoWall
      files={files}
      onChange={setFiles}
      multiple={multiple}
      carPreview={carPreview}
      showToolbar={showToolbar}
    />
  );
}

export const Empty: Story = {
  render: () => <InteractivePhotoWall />,
};

export const SingleUpload: Story = {
  render: () => <InteractivePhotoWall multiple={false} />,
};

export const MultipleUpload: Story = {
  render: () => <InteractivePhotoWall multiple />,
};

export const WithToolbar: Story = {
  render: () => <InteractivePhotoWall showToolbar />,
};

export const NoCarPreview: Story = {
  render: () => <InteractivePhotoWall carPreview={false} />,
};

export const NoCarPreviewMultiple: Story = {
  render: () => <InteractivePhotoWall carPreview={false} multiple />,
};

export const EchoUrlItems: Story = {
  render: () => (
    <InteractivePhotoWall
      initial={[
        'https://placehold.co/1920x1080/1a1a2e/e94560?text=BG',
        'https://placehold.co/1920x1080/16213e/0f3460?text=Overlay',
      ]}
      multiple
    />
  ),
};
