"use client";
import React from "react";
import { Image } from "@chakra-ui/next-js";

interface TeamImageProps {
  teamAbbreviation: string;
  size?: number;
}

export const buildLogoUrl = (abbreviation: string) => {
  return `https://static.www.nfl.com/league/api/clubs/logos/${abbreviation.toUpperCase()}.svg`;
};

export default function TeamLogo({
  teamAbbreviation,
  size = 48,
}: TeamImageProps) {
  return (
    <>
      <Image
        src={buildLogoUrl(teamAbbreviation)}
        alt={`${teamAbbreviation} logo`}
        width={size}
        height={size}
      />
    </>
  );
}
