import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from './frontmatter.ts';

describe('parseFrontmatter', () => {
  it('ignores scalar frontmatter and non-object metadata', () => {
    expect(parseFrontmatter('---\n42\n---\nbody').data).toEqual({});
    expect(
      parseFrontmatter('---\nname: example\ndescription: Example\nmetadata: invalid\n---\nbody')
        .data.metadata
    ).toBeUndefined();
  });
});
