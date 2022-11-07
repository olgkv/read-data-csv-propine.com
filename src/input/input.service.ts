import { parseArgs } from 'util';
import { OptionsValues, RecordValues } from '../input/input.types';

export class InputService {
  getInputData(): RecordValues {
    const args = process.argv;

    const options: OptionsValues = {
      tokenParameter: {
        type: 'string',
        short: 't',
      },
      dateParameter: {
        type: 'string',
        short: 'd',
      },
      help: {
        type: 'boolean',
        short: 'h',
      },
    };

    const {
      values: { tokenParameter, dateParameter },
    } = parseArgs({ options, args: args.slice(2) });

    return { tokenParameter, dateParameter } as RecordValues;
  }
}
