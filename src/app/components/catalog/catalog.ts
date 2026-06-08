import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CatalogService} from '../../services/catalog-service';
import {Annonce} from '../../webservices/contract';

@Component({
  selector: 'app-catalog',
  imports: [NgClass, RouterLink],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {

  protected catalog = inject(CatalogService);

  protected speciesTabs = [
    { label: 'Tous',   value: undefined },
    { label: 'Chiens', value: 'chien'   },
    { label: 'Chats',  value: 'chat'    },
    { label: 'NAC',    value: 'nac'     },
  ];

  protected sexeTabs = [
    { label: 'Tous',    value: undefined  },
    { label: 'Mâle',   value: 'male'     },
    { label: 'Femelle', value: 'femelle'  },
  ];

  protected activeEspece  = signal<string | undefined>(undefined);
  protected activeSexe    = signal<string | undefined>(undefined);
  protected activeUrgent  = signal<boolean | undefined>(undefined);
  protected currentPage   = signal(1);

  ngOnInit() {
    this.reload(1);
  }

  protected selectEspece(v: string | undefined) {
    this.activeEspece.set(v);
    this.reload(1);
  }

  protected selectSexe(v: string | undefined) {
    this.activeSexe.set(v);
    this.reload(1);
  }

  protected toggleUrgent() {
    this.activeUrgent.update(v => v === true ? undefined : true);
    this.reload(1);
  }

  protected prevPage() {
    if (this.currentPage() > 1) this.reload(this.currentPage() - 1);
  }

  protected nextPage() {
    if (this.currentPage() < this.catalog.pages()) this.reload(this.currentPage() + 1);
  }

  private reload(page: number) {
    this.currentPage.set(page);
    const filters: Record<string, string | boolean> = {};
    if (this.activeSexe())    filters['sexe']   = this.activeSexe()!;
    if (this.activeUrgent())  filters['urgent']  = true;
    this.catalog.load(this.activeEspece(), page, 20, filters);
  }

  protected photoUrl(annonce: Annonce): string {
    return annonce.animal.photos || 'https://placehold.co/400x300?text=Photo+indisponible';
  }
}
