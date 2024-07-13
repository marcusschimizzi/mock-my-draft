import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { forwardRef, LegacyRef } from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

export type InputFieldProps = {
  type?: 'text' | 'email' | 'password' | 'textarea';
  label?: string;
  error?: FieldError;
} & Partial<ReturnType<UseFormRegister<Record<string, unknown>>>>;

export const InputField = forwardRef(function InputField(
  props: InputFieldProps,
  ref: LegacyRef<HTMLInputElement> | LegacyRef<HTMLTextAreaElement> | undefined
) {
  const { type = 'text', label, error, ...inputProps } = props;

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      {type === 'textarea' ? (
        <Textarea
          ref={ref as LegacyRef<HTMLTextAreaElement>}
          bg="white"
          rows={8}
          {...inputProps}
        />
      ) : (
        <Input
          ref={ref as LegacyRef<HTMLInputElement>}
          type={type}
          {...inputProps}
          bg="white"
        />
      )}
      {error && (
        <FormHelperText color="red.500">{error.message}</FormHelperText>
      )}
    </FormControl>
  );
});
