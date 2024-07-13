jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));
