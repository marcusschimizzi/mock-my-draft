'use client';
import React, { useEffect, useState } from 'react';
import { Box, useToast, Progress } from '@chakra-ui/react';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FieldPath,
} from 'react-hook-form';
import { useSources } from '../../../lib/sources';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useTeams } from '@/lib/teams';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormValues, formSchema } from './form-types';
import ReviewStep from './review-step';
import TeamGradesStep from './team-grades-step';
import SourceArticleStep from './source-article-step';
import NavigationButtons from './navigation-buttons';
import FormStepper from './form-stepper';
import { useCreateSourceArticle } from '@/lib/sources-articles';
import { useCreateDraftGrade } from '@/lib/draft-grades';
import { useRouter } from 'next/navigation';

const SourceArticleForm: React.FC = () => {
  const { sources, isLoading } = useSources();
  const { teams, isLoading: teamsLoading } = useTeams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  const router = useRouter();

  const {
    submit: submitSourceArticle,
    isLoading: createSourceArticleLoading,
    submitAsync: submitSourceArticleAsync,
    data: sourceArticleData,
  } = useCreateSourceArticle({});
  const {
    submit: submitDraftGrade,
    isLoading: createDraftGradeLoading,
    data: draftGradeData,
    submitAsync: submitDraftGradeAsync,
  } = useCreateDraftGrade({});

  const steps = [
    {
      title: 'Article Details',
      description: 'Enter source article information',
    },
    { title: 'Draft Class Grades', description: 'Add grades for each team' },
    { title: 'Review', description: 'Review and submit' },
  ];

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, touchedFields },
    reset,
  } = useForm<FormValues>({
    resolver: async (data, context, options) => {
      console.log('Validating data', data);
      console.log(
        'Result:',
        await yupResolver<FormValues>(formSchema)(data, context, options),
      );
      return yupResolver<FormValues>(formSchema)(data, context, options);
    },
    mode: 'onBlur',
    defaultValues: {
      sourceId: '',
      title: '',
      url: '',
      publicationDate: '',
      year: new Date().getFullYear(),
      draftClassGrades: [],
    },
  });

  const { fields: draftClassFields, append: appendDraftClass } = useFieldArray({
    control,
    name: 'draftClassGrades',
  });

  // Initialize the form with teams if they are loaded
  useEffect(() => {
    if (teams.length > 0 && draftClassFields.length === 0) {
      console.info('Initializing draft class fields');
      console.info(
        'Teams length: ',
        teams.length,
        'Draft class fields length: ',
        draftClassFields.length,
      );
      teams.forEach((team) => {
        appendDraftClass({ teamId: team.id, grade: '', comments: '' });
      });
    }
  });

  useEffect(() => {
    console.log('Step changed:', step);
  }, [step]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.info('Submitting data', 'step:', step);
    if (step !== 3) {
      return;
    }

    console.info('Submitting data');
    console.log(data);

    setIsSubmitting(true);
    setProgress(0);

    // Simulate API calls
    try {
      const sourceArticle = await submitSourceArticleAsync({
        sourceId: data.sourceId,
        title: data.title,
        url: data.url,
        year: data.year,
        publicationDate: data.publicationDate,
      });
      setProgress(10);

      for (let i = 0; i < data.draftClassGrades.length; i++) {
        const grade = data.draftClassGrades[i];
        await submitDraftGradeAsync({
          sourceArticleId: sourceArticle.id,
          teamId: grade.teamId,
          grade: grade.grade,
          text: grade.comments,
          year: data.year,
        });
        setProgress(10 + ((i + 1) / data.draftClassGrades.length) * 90);
      }
      toast({
        title: 'Draft grades submitted',
        description: 'All draft grades have been submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
      setStep(1);
      router.push('/draft-grades');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while submitting the draft grades',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  const handleNext = async () => {
    console.info('Handling next', 'step:', step);
    let fieldsToValidate: FieldPath<FormValues>[] = [];
    if (step === 1) {
      fieldsToValidate = ['title', 'url', 'year', 'sourceId'];
    } else if (step === 2) {
      fieldsToValidate = draftClassFields.map(
        (_, index) => `draftClassGrades.${index}.grade` as const,
      );
    }
    console.info('We should be here');
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prevStep) => prevStep + 1);
    } else {
      toast({
        title: 'Error',
        description: 'Please fix the errors before proceeding',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;

    if (step === 1) {
      return !(
        touchedFields.title &&
        touchedFields.url &&
        touchedFields.year &&
        touchedFields.sourceId &&
        !errors.title &&
        !errors.url &&
        !errors.year &&
        !errors.sourceId
      );
    }

    if (step === 2) {
      return !draftClassFields.every(
        (_, index) =>
          touchedFields.draftClassGrades?.[index]?.grade &&
          !errors.draftClassGrades?.[index]?.grade,
      );
    }

    return false;
  };

  if (isLoading || teamsLoading) {
    return (
      <DashboardLayout>
        <Box>Loading...</Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box maxWidth="container.xl" margin="auto" p={5}>
        <FormStepper step={step} steps={steps} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Progress
            value={progress}
            mb={8}
            isIndeterminate={isSubmitting && progress === 0}
          />
          {step === 1 && (
            <SourceArticleStep
              control={control}
              errors={errors}
              sources={sources}
            />
          )}
          {step === 2 && (
            <TeamGradesStep
              control={control}
              errors={errors}
              fields={draftClassFields}
              teams={teams}
              sources={sources}
            />
          )}
          {step === 3 && (
            <ReviewStep
              watch={watch}
              setStep={setStep}
              teams={teams}
              sources={sources}
            />
          )}

          <NavigationButtons
            step={step}
            onBack={handlePrev}
            onNext={handleNext}
            isNextDisabled={isNextDisabled}
            isSubmitting={isSubmitting}
          />
        </form>
      </Box>
    </DashboardLayout>
  );
};

export default SourceArticleForm;
