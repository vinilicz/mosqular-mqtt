import { LocalizeDatePipe } from './localize-date-pipe';

describe('LocalizeDatePipe', () => {
  it('create an instance', () => {
    const pipe = new LocalizeDatePipe();
    expect(pipe).toBeTruthy();
  });
});
