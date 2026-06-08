import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {CatalogService} from '../../services/catalog-service';
import {Annonce} from '../../webservices/contract';

@Component({
  selector: 'app-catalog',
  imports: [NgClass],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {

  protected catalog = inject(CatalogService);

  protected speciesTabs = [
    { label: 'Tous',   value: undefined   },
    { label: 'Chiens', value: 'chien'     },
    { label: 'Chats',  value: 'chat'      },
    { label: 'NAC',    value: 'nac'       },
  ];

  protected activeEspece = signal<string | undefined>(undefined);

  ngOnInit() {
    this.catalog.load();
  }

  protected selectEspece(espece: string | undefined) {
    this.activeEspece.set(espece);
    this.catalog.load(espece);
  }

  protected photoUrl(annonce: Annonce): string {
    const p = annonce.animal.photos;
    return p ? p : 'images/animal-placeholder.jpg';
  }
}
