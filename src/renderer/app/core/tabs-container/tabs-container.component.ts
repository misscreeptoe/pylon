import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ImmutableArray } from '../../utils';
import { Tab, TabsStore, TabStatus } from '../store';
import { TabsComponent } from '../tabs';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [CommonModule, TabsComponent],
  templateUrl: './tabs-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContainerComponent implements OnInit {
  public tabs$: Observable<ImmutableArray<Tab>>;
  public tabStatus$: Observable<TabStatus>;

  constructor(private readonly tabsStore: TabsStore) {}

  public ngOnInit(): void {
    this.tabs$ = this.tabsStore.tabs$;
    this.tabStatus$ = this.tabsStore.tabStatus$;
  }

  public onTabClicked(tab: Tab): void {
    this.tabsStore.setActiveTab(tab.id);
  }

  public onTabCloseClicked(tab: Tab): void {
    this.tabsStore.removeTab(tab);
  }
}
