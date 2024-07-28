import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from '../../test-utils';
import SourceArticleForm from '@/app/(dashboard)/source-articles/create/page';
import { useSourceArticleForm } from '@/app/(dashboard)/source-articles/create/use-source-article-form';
import { useForm } from 'react-hook-form';
import { useUser } from '@/lib/get-user';
import { FormValues } from '@/app/(dashboard)/source-articles/create/form-types';
import { Conference, Division } from '@/types';

jest.mock('@/app/(dashboard)/source-articles/create/use-source-article-form');
jest.mock('@/lib/get-user');

describe('SourceArticleForm', () => {
  const mockUseSourceArticleForm = useSourceArticleForm as jest.MockedFunction<
    typeof useSourceArticleForm
  >;
  const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

  beforeEach(() => {
    global.ResizeObserver = class MockedResizeObserver {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
    const { result } = renderHook(() => useForm<FormValues>());
    mockUseUser.mockReturnValue({
      data: {
        user: {
          isAdmin: true,
          id: 'test-id',
          token: 'testingtoken',
          username: 'user',
          email: 'test@user.test',
        },
      },
      isLoading: false,
      isAdmin: true,
    });
    mockUseSourceArticleForm.mockReturnValue({
      step: 0,
      steps: [
        { title: 'Source', description: 'Step 1 description' },
        { title: 'Teams', description: 'Step 2 description' },
        { title: 'Review', description: 'Review description' },
      ],
      progress: 0,
      formMethods: result.current,
      draftClasses: [
        { year: 2021, teamId: '1', draftPicks: [] },
        { year: 2021, teamId: '2', draftPicks: [] },
      ],
      handleNext: jest.fn(),
      handlePrevious: jest.fn(),
      handleSubmit: jest.fn().mockImplementation((e) => e.preventDefault()),
      isNextDisabled: jest.fn().mockReturnValue(false),
      isLoading: false,
      isSubmitting: false,
      teams: [
        {
          id: '1',
          name: 'Team 1',
          location: 'Location 1',
          nickname: 'Nickname 1',
          abbreviation: 'T1',
          conference: Conference.AFC,
          division: Division.East,
          slug: 'team-1',
        },
        {
          id: '2',
          name: 'Team 2',
          location: 'Location 2',
          nickname: 'Nickname 2',
          abbreviation: 'T2',
          conference: Conference.NFC,
          division: Division.West,
          slug: 'team-2',
        },
      ],
      sources: [
        {
          id: '1',
          name: 'Source 1',
          baseUrl: 'http://source1.com',
          slug: 'source-1',
        },
        {
          id: '2',
          name: 'Source 2',
          baseUrl: 'http://source2.com',
          slug: 'source-2',
        },
      ],
      setStep: jest.fn(),
      draftClassFields: [
        { teamId: '1', grade: '', comments: '', playerGrades: [], id: '1' },
        { teamId: '2', grade: '', comments: '', playerGrades: [], id: '2' },
      ],
    });

    result.current.setValue('draftClassGrades', [
      { teamId: '1', grade: 'A', comments: '', playerGrades: [] },
      { teamId: '2', grade: 'B', comments: '', playerGrades: [] },
    ]);
    result.current.setValue('sourceId', '1');
    result.current.setValue('year', 2021);
    result.current.setValue('title', 'Test Title');
    result.current.setValue('url', 'http://test.com');
  });

  it('renders the form steps', () => {
    render(<SourceArticleForm />);
    expect(screen.getByText('Step 1 of 3: Source')).toBeInTheDocument();
  });

  it('renders loading state when isLoading is true', () => {
    mockUseSourceArticleForm.mockReturnValue({
      ...mockUseSourceArticleForm(),
      isLoading: true,
    });
    render(<SourceArticleForm />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders a progress bar', () => {
    render(<SourceArticleForm />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  describe('Navigating between steps', () => {
    describe('Step 1', () => {
      it('renders the SourceArticleStep component', () => {
        render(<SourceArticleForm />);
        expect(screen.getByLabelText('Title*')).toBeInTheDocument();
      });

      it('does not render previous button', () => {
        render(<SourceArticleForm />);
        expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      });

      it('renders next button', () => {
        render(<SourceArticleForm />);
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      it('calls handleNext when the next button is clicked', async () => {
        render(<SourceArticleForm />);
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => {
          expect(mockUseSourceArticleForm().handleNext).toHaveBeenCalled();
        });
      });
    });

    describe('Step 2', () => {
      beforeEach(() => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 1,
        });
      });

      it('renders the TeamGradesStep component', () => {
        render(<SourceArticleForm />);
        expect(screen.getByText('Step 2 of 3: Teams')).toBeInTheDocument();
      });

      it('renders previous button', () => {
        render(<SourceArticleForm />);
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });

      it('renders next button', () => {
        render(<SourceArticleForm />);
        expect(screen.getByText('Next')).toBeInTheDocument();
      });

      it('calls handlePrevious when the previous button is clicked', async () => {
        render(<SourceArticleForm />);
        fireEvent.click(screen.getByText('Previous'));
        await waitFor(() => {
          expect(mockUseSourceArticleForm().handlePrevious).toHaveBeenCalled();
        });
      });

      it('calls handleNext when the next button is clicked', async () => {
        render(<SourceArticleForm />);
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => {
          expect(mockUseSourceArticleForm().handleNext).toHaveBeenCalled();
        });
      });
    });

    describe('Step 3', () => {
      it('renders the ReviewStep component', () => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 2,
        });
        render(<SourceArticleForm />);
        expect(screen.getByText('Review and Submit')).toBeInTheDocument();
      });

      it('renders previous button', () => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 2,
        });
        render(<SourceArticleForm />);
        expect(screen.getByText('Previous')).toBeInTheDocument();
      });

      it('renders submit button', () => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 2,
        });
        render(<SourceArticleForm />);
        expect(screen.getByText('Submit')).toBeInTheDocument();
      });

      it('calls handlePrevious when the previous button is clicked', async () => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 2,
        });
        render(<SourceArticleForm />);
        fireEvent.click(screen.getByText('Previous'));
        await waitFor(() => {
          expect(mockUseSourceArticleForm().handlePrevious).toHaveBeenCalled();
        });
      });

      it('calls handleSubmit when the submit button is clicked', async () => {
        mockUseSourceArticleForm.mockReturnValue({
          ...mockUseSourceArticleForm(),
          step: 2,
        });
        render(<SourceArticleForm />);
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
          expect(mockUseSourceArticleForm().handleSubmit).toHaveBeenCalled();
        });
      });
    });
  });
});
