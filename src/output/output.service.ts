import { Logger } from '../handlers/logger.interface';

export class ConsoleLogger implements Logger {
  private static logger: ConsoleLogger;

  public static getInstance() {
    if (!ConsoleLogger.logger) {
      ConsoleLogger.logger = new ConsoleLogger();
    }

    return ConsoleLogger.logger;
  }

  log(...args: any[]): void {
    console.log(...args);
  }
  end(): void {
    console.log('Done');
  }
  error(...args: any[]): void {
    console.log(...args);
  }
}
