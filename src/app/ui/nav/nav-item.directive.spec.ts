import { NavItemDirective } from './nav-item.directive';

describe('NavItemDirective', () => {
  let directive: NavItemDirective;

  beforeEach(() => {
    directive = new NavItemDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
