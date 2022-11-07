import { ConsoleLogger } from './output/output.service.js';
import { Runner } from './runner/runner.js';

export class App {
  async run() {
    new Runner(ConsoleLogger.getInstance()).run();
  }
}

const app = new App();
app.run();
