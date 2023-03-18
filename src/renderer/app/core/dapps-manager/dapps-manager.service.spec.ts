import { DappsManagerService } from './dapps-manager.service';

describe('DappsManagerService', () => {
  let service: DappsManagerService;

  beforeEach(() => {
    service = new DappsManagerService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
