import { Badge, BadgeProps } from '@chakra-ui/react';
import { getGradeColor, gradeToLetter } from '../lib/grade-utils';

interface GradeBadgeProps extends Omit<BadgeProps, 'colorScheme'> {
  grade: number;
  variant?: 'solid' | 'premium';
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  variant = 'premium',
  ...props
}) => {
  const gradeColor = getGradeColor(grade);
  const gradeLetter = gradeToLetter(grade);

  if (variant === 'premium') {
    return (
      <Badge
        px={3}
        py={1}
        borderRadius="full"
        fontSize="sm"
        fontWeight="bold"
        bg={`${gradeColor}20`}
        color={gradeColor}
        border="1px solid"
        borderColor={gradeColor}
        backdropFilter="blur(8px)"
        {...props}
      >
        {gradeLetter}
      </Badge>
    );
  }

  return (
    <Badge
      px={3}
      py={1}
      borderRadius="full"
      fontSize="sm"
      fontWeight="bold"
      bg={gradeColor}
      color="white"
      {...props}
    >
      {gradeLetter}
    </Badge>
  );
};
