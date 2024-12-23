import { KeyeventDirectiveDirective } from './keyevent-directive.directive';

describe('KeyeventDirectiveDirective', () => {
  it('should create an instance', () => {
    const directive = new KeyeventDirectiveDirective();
    directive.jumpToPasteDialog();
    expect(directive).toBeTruthy();
  });
});
