import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DappListing } from '../../model';
import { RowComponent, ColumnComponent, ContainerComponent } from '../../ui';
import { DappListingCardComponent } from '../dapp-listing-card';
import { TabsStore } from '../store/tabs-store.service';

const DAPP_LISTINGS: DappListing[] = [
  {
    name: 'Internet Computer Docs',
    canisterId: 'hwvjt-wqaaa-aaaam-qadra-cai',
    description:
      "Deploy smart contracts and build scalable dapps on the Internet Computer - the world's fastest and most powerful open-source blockchain network",
  },
  {
    name: 'Motoko Playground',
    canisterId: 'm7sm4-2iaaa-aaaab-qabra-cai',
    description:
      "A playground for the Internet Computer's native Motoko language, brought to you by DFINITY",
  },
  {
    name: 'NFID',
    canisterId: '3y5ko-7qaaa-aaaal-aaaaq-cai',
    description:
      'The decentralized one-touch MFA identity provider and crypto wallet.',
  },
  {
    name: 'NNS',
    canisterId: 'qoctq-giaaa-aaaaa-aaaea-cai',
    url: 'https://nns.ic0.app',
    description: 'Asset Management and Voting for the Network Nervous System.',
  },
  {
    name: 'Internet Identity',
    canisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
    url: 'https://identity.ic0.app',
    description: 'Anonymous blockchain authentication framework.',
  },
  {
    name: 'Distrikt',
    canisterId: 'az5sd-cqaaa-aaaae-aaarq-cai',
    description:
      'A decentralized, professional social media network that empowers users to own and control their identity and data.',
  },
  {
    name: 'Taggr',
    canisterId: '6qfxa-ryaaa-aaaai-qbhsq-cai',
    description: 'Decentralized social media network.',
  },
];

const IC_DOMAIN = 'ic0.app';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ContainerComponent,
    RowComponent,
    ColumnComponent,
    DappListingCardComponent,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  public dappListings = DAPP_LISTINGS;

  constructor(private readonly tabsStore: TabsStore) {}

  public async onOpenDapp(dappListing: DappListing): Promise<void> {
    const url =
      dappListing.url ?? `https://${dappListing.canisterId}.${IC_DOMAIN}`;

    this.tabsStore.addTab({
      url,
      title: dappListing.name,
    });
  }
}
