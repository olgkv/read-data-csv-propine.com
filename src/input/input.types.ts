export interface Configuration {
  type: 'boolean' | 'string';
  short?: string;
}

export interface OptionsValues {
  [str: string]: Configuration;
}

export interface RecordValues {
  [str: string]: string | undefined;
}
