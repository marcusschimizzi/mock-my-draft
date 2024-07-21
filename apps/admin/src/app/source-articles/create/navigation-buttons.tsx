import { Button, HStack } from '@chakra-ui/react';

interface NavigationButtonsProps {
  step: number;
  isNextDisabled: () => boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}

function NavigationButtons({
  step,
  isNextDisabled,
  isSubmitting,
  onBack,
  onNext,
}: NavigationButtonsProps) {
  return (
    <HStack justifyContent="space-between" mt={8}>
      {step > 1 && (
        <Button onClick={onBack} isDisabled={isSubmitting}>
          Previous
        </Button>
      )}
      {step === 3 && (
        <Button
          type="submit"
          colorScheme="green"
          isLoading={isSubmitting}
          loadingText="Submitting..."
          isDisabled={isNextDisabled()}
        >
          Submit
        </Button>
      )}
      {step !== 3 && (
        <Button
          colorScheme={'blue'}
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
