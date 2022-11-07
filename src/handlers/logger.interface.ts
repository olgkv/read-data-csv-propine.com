export interface Logger {
  log(...args: any[]): void;
  end(): void;
  error(...args: any[]): void;
}
