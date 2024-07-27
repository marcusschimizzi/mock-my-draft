import {
  Box,
  Hide,
  Show,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
} from '@chakra-ui/react';

interface StepInfo {
  title: string;
  description: string;
}

interface FormStepperProps {
  step: number;
  steps: StepInfo[];
}

function FormStepper({ step, steps }: FormStepperProps) {
  return (
    <Stack>
      <Stepper index={step} mb={8}>
        {steps.map((stepInfo, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Show above="lg">
              <Box flexShrink="0">
                <StepTitle>{stepInfo.title}</StepTitle>
                <StepDescription>{stepInfo.description}</StepDescription>
              </Box>
            </Show>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Hide above="lg">
        <Text>
          Step {step + 1} of {steps.length}: {steps[step].title}
        </Text>
      </Hide>
    </Stack>
  );
}

export default FormStepper;
