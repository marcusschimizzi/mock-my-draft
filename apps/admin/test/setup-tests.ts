import '@testing-library/jest-dom';
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
