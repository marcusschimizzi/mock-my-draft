'use client';
import React from 'react';
import { Box, Progress } from '@chakra-ui/react';

import DashboardLayout from '@/layouts/dashboard-layout';
import ReviewStep from './review-step';
import TeamGradesStep from './team-grades-step';
import SourceArticleStep from './source-article-step';
import NavigationButtons from './navigation-buttons';
import FormStepper from './form-stepper';
import { Loading } from '@/components/loading';
import { useSourceArticleForm } from './use-source-article-form';

const SourceArticleForm: React.FC = () => {
  const {
    teams,
    sources,
    isLoading,
    isSubmitting,
    step,
    steps,
    setStep,
    formMethods,
    handleNext,
    handlePrevious,
    handleSubmit,
    progress,
    draftClasses,
    isNextDisabled,
  } = useSourceArticleForm();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box maxWidth="container.xl" margin="auto" p={5}>
      <FormStepper step={step} steps={steps} />

      <form onSubmit={handleSubmit}>
        <Progress
          value={progress}
          mb={8}
          isIndeterminate={isSubmitting && progress === 0}
        />
        {step === 0 && (
          <SourceArticleStep
            control={formMethods.control}
            errors={formMethods.formState.errors}
            sources={sources}
          />
        )}
        {step === 1 && (
          <>
            {isLoading ? (
              <Loading />
            ) : (
              <TeamGradesStep
                control={formMethods.control}
                teams={teams}
                draftClasses={draftClasses}
              />
            )}
          </>
        )}
        {step === 2 && (
          <ReviewStep
            watch={formMethods.watch}
            setStep={setStep}
            teams={teams}
            sources={sources}
          />
        )}

        <NavigationButtons
          step={step}
          numSteps={steps.length}
          onBack={handlePrevious}
          onNext={handleNext}
          isNextDisabled={isNextDisabled}
          isSubmitting={isSubmitting}
        />
      </form>
    </Box>
  );
};

const WrappedSourceArticleForm = () => (
  <DashboardLayout requireAdmin>
    <SourceArticleForm />
  </DashboardLayout>
);

export default WrappedSourceArticleForm;
