import { afterEach, expect, it, vi } from 'vitest';
import { cloneRepo, cleanupTempDir } from './git.ts';

const git = vi.hoisted(() => ({
  clone: vi.fn().mockResolvedValue(undefined),
  env: vi.fn().mockReturnThis(),
}));
vi.mock('simple-git', () => ({ default: () => git }));

let directory: string | undefined;
afterEach(async () => {
  if (directory) await cleanupTempDir(directory);
});

it('disables authentication prompts and LFS downloads during cloning', async () => {
  directory = await cloneRepo('https://example.com/skills.git');
  expect(git.env).toHaveBeenCalledWith(
    expect.objectContaining({ GIT_TERMINAL_PROMPT: '0', GIT_LFS_SKIP_SMUDGE: '1' })
  );
});
