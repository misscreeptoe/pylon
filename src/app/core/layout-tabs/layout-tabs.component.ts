import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent, NavItemDirective } from '../../ui';
import { DashboardComponent } from '../dashboard';
import { WebviewComponent } from '../webview';
import { DappsManagerService } from '../dapps-manager';
import { Observable } from 'rxjs';
import { DappListing } from '../../model';

@Component({
  selector: 'app-layout-tabs',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    NavItemDirective,
    DashboardComponent,
    WebviewComponent,
  ],
  templateUrl: './layout-tabs.component.html',
  styleUrls: ['./layout-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutTabsComponent implements OnInit {
  public dapps$: Observable<DappListing[]>;

  constructor(private readonly dappsManagerService: DappsManagerService) {}

  public ngOnInit(): void {
    this.dapps$ = this.dappsManagerService.dapps$;
  }
}
