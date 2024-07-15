'use client';

import Image from 'next/image';
import Link from 'next/link';

interface TeamLogoProps {
  teamAbbreviation: string;
  size?: 'small' | 'medium' | 'large';

  /** Optional link to a team page */
  href?: string;
}

export const buildLogoUrl = (teamAbbreviation: string) => {
  return `https://static.www.nfl.com/league/api/clubs/logos/${teamAbbreviation.toUpperCase()}.svg`;
};

export default function TeamLogo({
  teamAbbreviation,
  size = 'medium',
  href,
}: TeamLogoProps) {
  const src = buildLogoUrl(teamAbbreviation);
  const pixelSize = size === 'small' ? 24 : size === 'medium' ? 48 : 96;

  return (
    <>
      {href ? (
        <Link href={href}>
          <Image
            src={src}
            alt={`${teamAbbreviation} logo`}
            width={pixelSize}
            height={pixelSize}
          />
        </Link>
      ) : (
        <Image
          src={src}
          alt={`${teamAbbreviation} logo`}
          width={pixelSize}
          height={pixelSize}
        />
      )}
    </>
  );
}
