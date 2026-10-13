export function headingFontFamily(profileHeading: string, customFontAvailable: boolean): string {
  return customFontAvailable ? 'ProductionFont' : `${profileHeading}, Arial, sans-serif`;
}
