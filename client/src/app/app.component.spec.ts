import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: AppComponent;

  beforeEach(() => {
    fixture = new AppComponent();
  })

  it('should have a title gd-frontend', () => {
    expect(fixture.title).toEqual('gd-frontend');
  })
});
