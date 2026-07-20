import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { PhotoWall } from '../src/react/components/PhotoWall';

function createFile(name: string) {
  return new File([''], name, { type: 'image/png' });
}

describe('PhotoWall', () => {
  afterEach(cleanup);

  beforeAll(() => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('should render upload area when files is empty', () => {
    render(<PhotoWall files={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  it('should render image thumbnails for File items', () => {
    const files = [createFile('a.png'), createFile('b.png')];
    const { container } = render(<PhotoWall files={files} onChange={vi.fn()} />);
    const thumbs = container.querySelectorAll('[aria-label*="Remove"]');
    expect(thumbs).toHaveLength(2);
  });

  it('should render image thumbnails for string URL items', () => {
    const files = ['https://example.com/a.png', 'https://example.com/b.png'];
    const { container } = render(<PhotoWall files={files} onChange={vi.fn()} />);
    const imgs = container.querySelectorAll('[aria-label*="Remove"]');
    expect(imgs).toHaveLength(2);
    const buttons = screen.getAllByRole('button', { name: /remove/i });
    expect(buttons).toHaveLength(2);
  });

  it('should show add button for multiple mode', () => {
    render(<PhotoWall files={[createFile('a.png')]} onChange={vi.fn()} multiple />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('should not show add button for single mode', () => {
    render(<PhotoWall files={[createFile('a.png')]} onChange={vi.fn()} multiple={false} />);
    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });

  it('should show replace button for single mode', () => {
    render(<PhotoWall files={[createFile('a.png')]} onChange={vi.fn()} multiple={false} />);
    expect(screen.getByText(/replace/i)).toBeInTheDocument();
  });

  it('should call onChange when file is selected via input', () => {
    const onChange = vi.fn();
    const { container } = render(<PhotoWall files={[]} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    const file = createFile('new.png');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('should remove a File item when delete is clicked', () => {
    const files = [createFile('a.png'), createFile('b.png')];
    const onChange = vi.fn();
    render(<PhotoWall files={files} onChange={onChange} multiple />);
    const buttons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(buttons[0]);
    expect(onChange).toHaveBeenCalledWith([files[1]]);
  });

  it('should remove a string URL item when delete is clicked', () => {
    const files = ['https://example.com/a.png', 'https://example.com/b.png'];
    const onChange = vi.fn();
    render(<PhotoWall files={files} onChange={onChange} multiple />);
    const buttons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(buttons[0]);
    expect(onChange).toHaveBeenCalledWith(['https://example.com/b.png']);
  });

  it('should show car preview by default', () => {
    const files = [createFile('a.png')];
    const { container } = render(<PhotoWall files={files} onChange={vi.fn()} />);
    expect(container.querySelector('[aria-label*="screen preview"]')).toBeInTheDocument();
  });

  it('should hide car preview when carPreview is false', () => {
    const files = [createFile('a.png')];
    const { container } = render(<PhotoWall files={files} onChange={vi.fn()} carPreview={false} />);
    expect(container.querySelector('[aria-label*="screen preview"]')).not.toBeInTheDocument();
  });
});
