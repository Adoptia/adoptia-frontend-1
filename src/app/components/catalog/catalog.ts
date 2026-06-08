import {ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CatalogService} from '../../services/catalog-service';
import {Annonce} from '../../webservices/contract';

@Component({
  selector: 'app-catalog',
  imports: [NgClass, RouterLink],
  templateUrl: './catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit, OnDestroy {

  protected catalog = inject(CatalogService);

  protected activeEspece    = signal<string | undefined>(undefined);
  protected activeSexe      = signal<string | undefined>(undefined);
  protected activeUrgent    = signal(false);
  protected activeSterilise = signal(false);
  protected activeVaccine   = signal(false);
  protected activeSource    = signal<string | undefined>(undefined);
  protected activeQ         = signal('');
  protected activeVille     = signal('');
  protected currentPage     = signal(1);
  protected activeLimit     = signal(20);
  protected showFilters     = signal(false);

  private searchSubject = new Subject<string>();
  private villeSubject  = new Subject<string>();
  private sub = this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(q => { this.activeQ.set(q); this.reload(1); });
  private subVille = this.villeSubject.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(v => { this.activeVille.set(v); this.reload(1); });

  protected speciesTabs = [
    { label: 'Tous',   value: undefined },
    { label: 'Chiens', value: 'chien'   },
    { label: 'Chats',  value: 'chat'    },
    { label: 'NAC',    value: 'nac'     },
  ];

  protected sexeTabs = [
    { label: 'Tous',    value: undefined  },
    { label: 'Mâle',   value: 'Mâle'     },
    { label: 'Femelle', value: 'Femelle' },
  ];

  protected sourceTabs = [
    { label: 'Toutes sources', value: undefined       },
    { label: 'Seconde Chance', value: 'secondechance' },
    { label: 'SPA',            value: 'spa'           },
  ];

  protected limitOptions = [12, 24, 48];

  protected activeBadges = computed(() => {
    const b: { key: string; label: string }[] = [];
    if (this.activeEspece())    b.push({ key: 'espece',    label: this.activeEspece()! });
    if (this.activeSexe())      b.push({ key: 'sexe',      label: this.activeSexe()! });
    if (this.activeUrgent())    b.push({ key: 'urgent',    label: 'Urgent' });
    if (this.activeSterilise()) b.push({ key: 'sterilise', label: 'Stérilisé' });
    if (this.activeVaccine())   b.push({ key: 'vaccine',   label: 'Vacciné' });
    if (this.activeSource())    b.push({ key: 'source',    label: this.activeSource()! });
    if (this.activeQ())         b.push({ key: 'q',         label: `"${this.activeQ()}"` });
    if (this.activeVille())     b.push({ key: 'ville',     label: `📍 ${this.activeVille()}` });
    return b;
  });

  protected pageNumbers = computed((): (number | '...')[] => {
    const total = this.catalog.pages();
    const cur   = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (cur > 3) pages.push('...');
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p);
    if (cur < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  ngOnInit()    { this.reload(1); }
  ngOnDestroy() { this.sub.unsubscribe(); this.subVille.unsubscribe(); }

  protected onSearch(q: string)           { this.searchSubject.next(q); }
  protected onVilleInput(v: string)       { this.villeSubject.next(v); }
  protected selectEspece(v: string | undefined) { this.activeEspece.set(v); this.reload(1); }
  protected selectSexe(v: string | undefined)   { this.activeSexe.set(v);   this.reload(1); }
  protected selectSource(v: string | undefined) { this.activeSource.set(v); this.reload(1); }
  protected toggleUrgent()    { this.activeUrgent.update(v    => !v); this.reload(1); }
  protected toggleSterilise() { this.activeSterilise.update(v => !v); this.reload(1); }
  protected toggleVaccine()   { this.activeVaccine.update(v   => !v); this.reload(1); }
  protected toggleFilters()   { this.showFilters.update(v     => !v); }
  protected setLimit(n: number) { this.activeLimit.set(n); this.reload(1); }

  protected removeBadge(key: string) {
    const map: Record<string, () => void> = {
      espece:    () => this.activeEspece.set(undefined),
      sexe:      () => this.activeSexe.set(undefined),
      urgent:    () => this.activeUrgent.set(false),
      sterilise: () => this.activeSterilise.set(false),
      vaccine:   () => this.activeVaccine.set(false),
      source:    () => this.activeSource.set(undefined),
      q:         () => this.activeQ.set(''),
      ville:     () => this.activeVille.set(''),
    };
    map[key]?.();
    this.reload(1);
  }

  protected resetAll() {
    this.activeEspece.set(undefined);
    this.activeSexe.set(undefined);
    this.activeUrgent.set(false);
    this.activeSterilise.set(false);
    this.activeVaccine.set(false);
    this.activeSource.set(undefined);
    this.activeQ.set('');
    this.activeVille.set('');
    this.reload(1);
  }

  protected goToPage(p: number | '...') {
    if (typeof p === 'number') this.reload(p);
  }

  protected prevPage() { if (this.currentPage() > 1) this.reload(this.currentPage() - 1); }
  protected nextPage() { if (this.currentPage() < this.catalog.pages()) this.reload(this.currentPage() + 1); }

  private reload(page: number) {
    this.currentPage.set(page);
    const filters: Record<string, string | boolean> = {};
    if (this.activeSexe())      filters['sexe']        = this.activeSexe()!;
    if (this.activeUrgent())    filters['urgent']       = true;
    if (this.activeSterilise()) filters['sterilise']    = true;
    if (this.activeVaccine())   filters['vaccine']      = true;
    if (this.activeSource())    filters['source_site']  = this.activeSource()!;
    if (this.activeQ())         filters['q']            = this.activeQ();
    if (this.activeVille())     filters['ville']        = this.activeVille();
    this.catalog.load(this.activeEspece(), page, this.activeLimit(), filters);
  }

  protected photoUrl(annonce: Annonce): string {
    return annonce.animal.photos || 'https://placehold.co/400x300?text=Photo+indisponible';
  }
}
