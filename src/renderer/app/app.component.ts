import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ElectronService, LayoutComponent } from './core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(private readonly electronService: ElectronService) {}

  public ngOnInit(): void {
    this.electronService.initIpcEvents();
  }
}
