'use client';

import { useSourceArticle } from '@/lib/sources-articles';
import { Box, Progress } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useSourceArticleForm } from '../../create/use-source-article-form';
import FormStepper from '../../create/form-stepper';
import TeamGradesStep from '../../create/team-grades-step';
import { Loading } from '@/components/loading';
import SourceArticleStep from '../../create/source-article-step';
import NavigationButtons from '../../create/navigation-buttons';
import ReviewStep from '../../create/review-step';

const SourceArticleEditPage = () => {
  const { sourceArticleId } = useParams<{ sourceArticleId: string }>();
  const { sourceArticle, isLoading: isSourceArticleLoading } =
    useSourceArticle(sourceArticleId);

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
  } = useSourceArticleForm({
    existingSourceArticle: sourceArticle
      ? {
          id: sourceArticle.id,
          sourceId: sourceArticle.source.id,
          title: sourceArticle.title,
          url: sourceArticle.url,
          publicationDate: sourceArticle.publicationDate,
          year: sourceArticle.year,
          draftClassGrades: (sourceArticle.draftClassGrades ?? []).map(
            (grade) => ({
              id: grade.id,
              teamId: grade.team.id,
              grade: grade.grade,
              comments: grade.text,
              playerGrades: grade.playerGrades.map((playerGrade) => ({
                id: playerGrade.id,
                playerId: playerGrade.player.id,
                grade: playerGrade.grade,
                comments: playerGrade.text,
                draftPickId: playerGrade.draftPick.id,
              })),
            }),
          ),
        }
      : undefined,
  });

  if (isSourceArticleLoading) {
    return <Loading />;
  }

  return (
    <div>
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
    </div>
  );
};

export default SourceArticleEditPage;
