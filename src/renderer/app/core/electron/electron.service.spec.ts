import { ElectronService } from './electron.service';

describe('ElectronService', () => {
  let service: ElectronService;

  beforeEach(() => {
    service = new ElectronService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
