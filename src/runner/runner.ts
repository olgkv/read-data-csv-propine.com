import { createReadStream } from 'fs';
import * as readline from 'readline/promises';
import ExchangeService from '../api/exchange.api.js';
import { FileService } from '../files/file.service.js';
import { Logger } from '../handlers/logger.interface.js';
import { InputService } from '../input/input.service.js';
import { Actions, Portfolio } from './runner.types';

export class Runner {
  private fileService: FileService = new FileService();
  private inputService: InputService = new InputService();
  private header: boolean = false;
  private params;
  private portfolio: Map<string, number> | undefined = new Map();

  constructor(private logger: Logger) {
    this.params = this.inputService.getInputData();
  }

  async run() {
    this.params = this.inputService.getInputData();

    const readStream = createReadStream(
      this.fileService.getFilePath('data/transactions.csv')
    );

    const readLine = readline.createInterface({ input: readStream });

    for await (const line of readLine) {
      this.parselineHandler(line);
    }

    const portfolioInUsd: Portfolio = await this.convertToUSD(
      this.portfolio as any
    );

    this.logger.log(portfolioInUsd, 'In USD');
  }

  private calculatePortfolio(
    portfolio: Map<string, number> | undefined,
    token: string,
    action: string,
    amount: string
  ): Map<string, number> | undefined {
    if (portfolio?.has(token)) {
      let currentAmount = portfolio.get(token);
      if (!currentAmount) return;
      let money = Number(amount);

      portfolio.set(
        token,
        action === Actions.DEPOSIT
          ? currentAmount + money
          : currentAmount - money
      );
    } else {
      portfolio?.set(token, Number(amount));
    }
    return portfolio;
  }

  private async convertToUSD(portfolio: Map<string, number>) {
    for (const [token, amount] of portfolio) {
      const { USD: usd } = await ExchangeService.getRate(token);
      portfolio.set(token, amount * Number(usd));
    }
    return portfolio;
  }

  private isSameDayOrEarlier(dateParameter: string, dataDate: string) {
    let date = new Date(Number(dataDate) * 1000);

    return (
      new Date(dateParameter).getTime() >=
      new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()}`
      ).getTime()
    );
  }

  private parselineHandler(line: string) {
    const data = line.split('\t');

    if (!this.header && Array.isArray(data)) {
      this.header = true;
      return;
    }

    let [record] = data;
    let [date, action, token, amount] = record.split(',');

    // Given no parameters, return the latest portfolio value per token in USD

    if (
      typeof this.params.tokenParameter === 'undefined' &&
      typeof this.params.dateParameter === 'undefined'
    ) {
      this.portfolio = this.calculatePortfolio(
        this.portfolio,
        token,
        action,
        amount
      );
    }

    // Given a token, return the latest portfolio value for that token in USD

    if (
      typeof this.params.tokenParameter !== 'undefined' &&
      typeof this.params.dateParameter === 'undefined'
    ) {
      if (token == this.params.tokenParameter) {
        this.portfolio = this.calculatePortfolio(
          this.portfolio,
          token,
          action,
          amount
        );
      }
    }

    // Given a date, return the portfolio value per token in USD on that date
    // date as string '1571966849' in seconds

    if (
      typeof this.params.tokenParameter === 'undefined' &&
      typeof this.params.dateParameter !== 'undefined'
    ) {
      if (this.isSameDayOrEarlier(this.params.dateParameter as string, date)) {
        this.portfolio = this.calculatePortfolio(
          this.portfolio,
          token,
          action,
          amount
        );
      }
    }

    //  Given a date and a token, return the portfolio value of that token in USD
    //  on that date

    if (
      typeof this.params.tokenParameter !== 'undefined' &&
      typeof this.params.dateParameter !== 'undefined'
    ) {
      if (
        token === this.params.tokenParameter &&
        this.isSameDayOrEarlier(this.params.dateParameter as string, date)
      ) {
        this.portfolio = this.calculatePortfolio(
          this.portfolio,
          token,
          action,
          amount
        );
      }
    }
  }
}
