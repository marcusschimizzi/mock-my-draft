'use client';
import React from 'react';
import { Image, Link } from '@chakra-ui/next-js';

interface TeamImageProps {
  teamAbbreviation: string;
  size?: number;

  /** Optional href to link to team page. */
  href?: string;
}

export const buildLogoUrl = (abbreviation: string) => {
  return `https://static.www.nfl.com/league/api/clubs/logos/${abbreviation.toUpperCase()}.svg`;
};

export default function TeamLogo({
  teamAbbreviation,
  size = 48,
  href,
}: TeamImageProps) {
  return (
    <>
      {href ? (
        <Link href={href}>
          <Image
            src={buildLogoUrl(teamAbbreviation)}
            alt={`${teamAbbreviation} logo`}
            width={size}
            height={size}
          />
        </Link>
      ) : (
        <Image
          src={buildLogoUrl(teamAbbreviation)}
          alt={`${teamAbbreviation} logo`}
          width={size}
          height={size}
        />
      )}
    </>
  );
}
