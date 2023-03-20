import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent, NavItemDirective } from '../../ui';
import { DashboardComponent } from '../dashboard';
import { WebviewComponent } from '../webview';
import { Observable } from 'rxjs';
import { Tab, TabsStore } from '../store';
import { ImmutableArray } from '../../utils';

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
  public tabs$: Observable<ImmutableArray<Tab>>;
  public activeTab$: Observable<number>;

  constructor(private readonly tabsStore: TabsStore) {}

  public ngOnInit(): void {
    this.tabs$ = this.tabsStore.tabs$;
    this.activeTab$ = this.tabsStore.activeTab$;
  }

  public onTabCloseClicked(tab: Tab): void {
    this.tabsStore.removeTab(tab);
  }

  public onActiveTabChange(id: number): void {
    this.tabsStore.setActiveTab(id);
  }
}
