import { Button, HStack } from '@chakra-ui/react';

interface NavigationButtonsProps {
  step: number;
  numSteps: number;
  isNextDisabled: () => boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

function NavigationButtons({
  step,
  numSteps,
  isNextDisabled,
  isSubmitting,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  return (
    <HStack justifyContent="space-between" mt={8}>
      {step > 0 && (
        <Button onClick={onBack} isDisabled={isSubmitting}>
          Previous
        </Button>
      )}
      {step === numSteps - 1 && (
        <Button
          type="submit"
          colorScheme="secondary"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          isDisabled={isNextDisabled()}
        >
          Submit
        </Button>
      )}
      {step !== numSteps - 1 && (
        <Button
          colorScheme={'primary'}
          isDisabled={isNextDisabled()}
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </HStack>
  );
}

export default NavigationButtons;
