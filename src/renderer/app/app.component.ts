import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FG_LOADED } from '../ipc';
import { ElectronService, LayoutComponent } from './core';
import { TabsService } from './core/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly electronService: ElectronService,
    private readonly tabsService: TabsService,
  ) {}

  public ngOnInit(): void {
    this.tabsService.initIpcEvents();
    this.electronService.invoke(FG_LOADED);
  }
}
