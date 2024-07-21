import {
  Box,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
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
          <Box flexShrink="0">
            <StepTitle>{stepInfo.title}</StepTitle>
            <StepDescription>{stepInfo.description}</StepDescription>
          </Box>
          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
}

export default FormStepper;
