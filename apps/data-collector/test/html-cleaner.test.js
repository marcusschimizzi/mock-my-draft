const { cleanHtml } = require('../html-cleaner');

describe('cleanHtml', () => {
  it('should strip script tags', () => {
    const html = '<div><p>Content</p><script>alert("x")</script></div>';
    const result = cleanHtml(html);
    expect(result).not.toContain('<script');
    expect(result).toContain('Content');
  });

  it('should strip nav, footer, aside, header elements', () => {
    const html = `
      <nav>Nav stuff</nav>
      <header>Header stuff</header>
      <main><article><p>Grade: A+</p></article></main>
      <aside>Sidebar</aside>
      <footer>Footer stuff</footer>
    `;
    const result = cleanHtml(html);
    expect(result).not.toContain('Nav stuff');
    expect(result).not.toContain('Header stuff');
    expect(result).not.toContain('Sidebar');
    expect(result).not.toContain('Footer stuff');
    expect(result).toContain('Grade: A+');
  });

  it('should strip style tags', () => {
    const html = '<div><style>.foo{color:red}</style><p>Content</p></div>';
    const result = cleanHtml(html);
    expect(result).not.toContain('<style');
    expect(result).toContain('Content');
  });

  it('should strip ad-related elements by common class names', () => {
    const html = `
      <div class="ad-container">Buy stuff</div>
      <div class="advertisement">More ads</div>
      <div class="article-body"><p>Real content</p></div>
    `;
    const result = cleanHtml(html);
    expect(result).not.toContain('Buy stuff');
    expect(result).toContain('Real content');
  });

  it('should return the cleaned HTML string', () => {
    const html = '<html><body><main><p>Hello</p></main></body></html>';
    const result = cleanHtml(html);
    expect(typeof result).toBe('string');
    expect(result).toContain('Hello');
  });
});
