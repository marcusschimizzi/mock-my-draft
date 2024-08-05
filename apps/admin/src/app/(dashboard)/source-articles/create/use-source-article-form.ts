import { useCreateDraftGrade, useUpdateDraftGrade } from '@/lib/draft-grades';
import {
  useCreatePlayerGrade,
  useUpdatePlayerGrade,
} from '@/lib/player-grades';
import {
  useCreateSourceArticle,
  useUpdateSourceArticle,
} from '@/lib/sources-articles';
import { useTeams } from '@/lib/teams';
import { DraftClass } from '@/types';
import { useEffect, useState } from 'react';
import { formSchema, FormValues } from './form-types';
import {
  FieldPath,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { getDraftClassesByYear } from '@/lib/draft-class';
import { useSources } from '@/lib/sources';

interface UseSourceArticleFormProps {
  existingSourceArticle?: FormValues & { id: string };
}

export const useSourceArticleForm = ({
  existingSourceArticle,
}: UseSourceArticleFormProps = {}) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [draftClasses, setDraftClasses] = useState<DraftClass[]>([]);

  const { sources, isLoading: sourcesLoading } = useSources();
  const { teams, isLoading: isTeamsLoading } = useTeams();
  const { submitAsync: submitSourceArticleAsync } = useCreateSourceArticle({});
  const { submitAsync: updateSourceArticleAsync } = useUpdateSourceArticle({});
  const { submitAsync: submitDraftGradeAsync } = useCreateDraftGrade({});
  const { submitAsync: updateDraftGradeAsync } = useUpdateDraftGrade({});
  const { submitAsync: submitPlayerGradeAsync } = useCreatePlayerGrade({});
  const { submitAsync: updatePlayerGradeAsync } = useUpdatePlayerGrade({});

  const router = useRouter();
  const toast = useToast();

  const steps = [
    {
      title: 'Article Details',
      description: 'Enter source article information',
    },
    { title: 'Draft Class Grades', description: 'Add grades for each team' },
    { title: 'Review', description: 'Review and submit' },
  ];

  const formMethods = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      sourceId: existingSourceArticle?.sourceId ?? '',
      title: existingSourceArticle?.title ?? '',
      url: existingSourceArticle?.url ?? '',
      publicationDate: existingSourceArticle?.publicationDate
        ? new Date(existingSourceArticle.publicationDate)
            .toISOString()
            .split('T')[0]
        : '',
      year: existingSourceArticle?.year ?? new Date().getFullYear(),
      draftClassGrades: existingSourceArticle?.draftClassGrades ?? [],
    },
  });

  const { handleSubmit, trigger, getValues, setValue } = formMethods;

  const { fields: draftClassFields } = useFieldArray({
    control: formMethods.control,
    name: 'draftClassGrades',
  });

  const handleNext = async () => {
    let fieldsToValidate: FieldPath<FormValues>[] = [];
    if (step === 0) {
      fieldsToValidate = ['title', 'url', 'year', 'sourceId'];
    } else if (step === 1) {
      fieldsToValidate = draftClassFields.map(
        (_, index) => `draftClassGrades.${index}.grade` as const,
      );
    }
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      if (step === 0) {
        // Fetch draft class information
        setIsLoading(true);
        const year = getValues('year');
        const draftClasses = await getDraftClassesByYear(year);
        setDraftClasses(draftClasses);

        // Update draft class grades with new information
        const updatedDraftClassGrades: FormValues['draftClassGrades'] =
          getValues('draftClassGrades').map((grade) => ({
            ...grade,
            playerGrades:
              draftClasses
                .find((draftClass) => draftClass.teamId === grade.teamId)
                ?.draftPicks.filter((pick) => pick.player !== undefined)
                .map((draftPick) => ({
                  playerId: draftPick.player!.id,
                  grade: '',
                  comments: '',
                  draftPickId: draftPick.id,
                })) || [],
          }));
        setValue('draftClassGrades', updatedDraftClassGrades);
        setIsLoading(false);
      }
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

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const isNextDisabled = () => {
    if (isSubmitting) return true;

    if (step === 0) {
      return !(
        !formMethods.formState.errors.title &&
        !formMethods.formState.errors.url &&
        !formMethods.formState.errors.year &&
        !formMethods.formState.errors.sourceId
      );
    }

    if (step === 1) {
      return !draftClassFields.every(
        (_, index) =>
          !formMethods.formState.errors.draftClassGrades?.[index]?.grade,
      );
    }

    return false;
  };

  const onSubmit: SubmitHandler<FormValues> = async (values: FormValues) => {
    if (step !== steps.length - 1) {
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    try {
      let sourceArticle;
      if (existingSourceArticle) {
        sourceArticle = await updateSourceArticleAsync({
          id: existingSourceArticle.id,
          sourceId: values.sourceId,
          title: values.title,
          url: values.url,
          year: values.year,
          publicationDate: values.publicationDate,
        });
      } else {
        sourceArticle = await submitSourceArticleAsync({
          sourceId: values.sourceId,
          title: values.title,
          url: values.url,
          year: values.year,
          publicationDate: values.publicationDate,
        });
      }
      setProgress(10);

      for (let i = 0; i < values.draftClassGrades.length; i++) {
        const grade = values.draftClassGrades[i];

        if (grade.playerGrades) {
          // Submit player grades
          for (let j = 0; j < grade.playerGrades.length; j++) {
            const playerGrade = grade.playerGrades[j];
            // Only submit if either grade or comments are present
            if (playerGrade.grade || playerGrade.comments) {
              console.info('Submitting player grade', playerGrade);
              if (existingSourceArticle && playerGrade.id) {
                await updatePlayerGradeAsync({
                  id: playerGrade.id,
                  sourceArticleId: sourceArticle.id,
                  teamId: grade.teamId,
                  playerId: playerGrade.playerId,
                  grade: playerGrade.grade,
                  text: playerGrade.comments,
                  draftPickId: playerGrade.draftPickId,
                });
              } else {
                await submitPlayerGradeAsync({
                  sourceArticleId: sourceArticle.id,
                  teamId: grade.teamId,
                  playerId: playerGrade.playerId,
                  grade: playerGrade.grade,
                  text: playerGrade.comments,
                  draftPickId: playerGrade.draftPickId,
                });
              }
            }
          }
        }

        // Submit draft grades
        if (existingSourceArticle && grade.id) {
          await updateDraftGradeAsync({
            id: grade.id,
            sourceArticleId: sourceArticle.id,
            teamId: grade.teamId,
            grade: grade.grade,
            text: grade.comments,
            year: values.year,
          });
        } else {
          await submitDraftGradeAsync({
            sourceArticleId: sourceArticle.id,
            teamId: grade.teamId,
            grade: grade.grade,
            text: grade.comments,
            year: values.year,
          });
        }
        setProgress(10 + ((i + 1) / values.draftClassGrades.length) * 90);
      }
      toast({
        title: existingSourceArticle
          ? 'Draft grades updated'
          : 'Draft grades submitted',
        description: `All draft grades have been ${
          existingSourceArticle ? 'updated' : 'submitted'
        } successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      formMethods.reset();
      setStep(0);
      router.push('/draft-grades');
    } catch (error) {
      toast({
        title: 'Error',
        description: `An error occurred while ${
          existingSourceArticle ? 'updating' : 'submitting'
        } the draft grades`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    const initializeForm = async () => {
      if (teams.length > 0 && !isFormInitialized) {
        let initialDraftClassGrades;
        if (existingSourceArticle) {
          // We need to make sure that the draft class grades are in the same order as the teams
          const draftClasses = await getDraftClassesByYear(
            existingSourceArticle.year,
          );
          setDraftClasses(draftClasses);

          initialDraftClassGrades = teams.map((team) => {
            const existingDraftClassGrade =
              existingSourceArticle.draftClassGrades.find(
                (grade) => grade.teamId === team.id,
              );
            const draftClass = draftClasses.find((dc) => dc.teamId === team.id);
            if (existingDraftClassGrade) {
              return {
                ...existingDraftClassGrade,
                playerGrades: draftClass?.draftPicks
                  .filter((pick) => pick.player !== undefined)
                  .map((draftPick) => {
                    const existingPlayerGrade =
                      existingDraftClassGrade.playerGrades?.find(
                        (pg) => pg.playerId === draftPick.player?.id,
                      );
                    return {
                      id: existingPlayerGrade?.id,
                      playerId: draftPick.player!.id,
                      grade: existingPlayerGrade?.grade || '',
                      comments: existingPlayerGrade?.comments || '',
                      draftPickId: draftPick.id,
                    };
                  }),
              };
            }
            return {
              teamId: team.id,
              grade: '',
              comments: '',
              playerGrades:
                draftClass?.draftPicks
                  .filter((pick) => pick.player !== undefined)
                  .map((draftPick) => ({
                    playerId: draftPick.player!.id,
                    grade: '',
                    comments: '',
                    draftPickId: draftPick.id,
                  })) || [],
            };
          });
        } else {
          initialDraftClassGrades = teams.map((team) => ({
            teamId: team.id,
            grade: '',
            comments: '',
            playerGrades: [],
          }));
        }
        formMethods.reset({
          ...formMethods.getValues(),
          draftClassGrades: initialDraftClassGrades,
        });
        setIsFormInitialized(true);
      }
    };
    initializeForm();
  }, [teams, formMethods, existingSourceArticle, isFormInitialized]);

  return {
    step,
    steps,
    setStep,
    isLoading:
      isLoading || isTeamsLoading || !isFormInitialized || sourcesLoading,
    isSubmitting,
    progress,
    formMethods,
    draftClasses,
    draftClassFields,
    handleNext,
    handlePrevious,
    handleSubmit: handleSubmit(onSubmit),
    isNextDisabled,
    teams,
    sources,
    isEditing: !!existingSourceArticle,
  };
};
