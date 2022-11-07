export const enum Actions {
  'DEPOSIT' = 'DEPOSIT',
  'WITHDRAWAL' = 'WITHDRAWAL',
}

export type Portfolio = Map<string, number> | undefined;
