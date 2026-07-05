import { computed, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categorie, Plat } from '../models/plat';

/** Catégorie sélectionnable dans le filtre (« Toutes » = pas de filtre). */
export type FiltreCategorie = 'Toutes' | Categorie;

/**
 * Couche de données de la carte « Délices de Douala ».
 * Source de vérité centralisée, réactive (signals) et alimentée par le serveur.
 */
@Injectable({ providedIn: 'root' })
export class MenuService {
  /** Catégories proposées dans les boutons de filtre. */
  readonly categories: readonly FiltreCategorie[] = [
    'Toutes',
    'Plats',
    'Grillades',
    'Végétarien',
    'Boissons',
  ];

  /**
   * Menu chargé depuis le « serveur » (GET /api/plats.json).
   * Expose les trois états : isLoading(), error(), value().
   */
  readonly menu = httpResource<Plat[]>(
    () => `${environment.serverUrl}/api/plats.json`
  );

  /** État encapsulé : catégorie sélectionnée (signal privé, exposé en lecture seule). */
  private readonly _categorie = signal<FiltreCategorie>('Toutes');
  readonly categorie = this._categorie.asReadonly();

  /** État encapsulé : terme de recherche (bonus). */
  private readonly _recherche = signal('');
  readonly recherche = this._recherche.asReadonly();

  /** Plats chargés (tableau vide tant que la ressource n'a pas de valeur). */
  private readonly plats = computed<Plat[]>(() =>
    this.menu.hasValue() ? this.menu.value() ?? [] : []
  );

  /** Liste dérivée du menu + catégorie + recherche. Aucun recalcul manuel. */
  readonly platsFiltres = computed<Plat[]>(() => {
    const plats = this.plats();
    const categorie = this._categorie();
    const terme = this._recherche().trim().toLowerCase();

    return plats
      .filter((plat) => categorie === 'Toutes' || plat.categorie === categorie)
      .filter((plat) => terme === '' || plat.nom.toLowerCase().includes(terme));
  });

  /** Nombre de plats disponibles à la carte. */
  readonly nombreDisponibles = computed(
    () => this.plats().filter((p) => p.disponible).length
  );

  /** Index qui tourne toutes les 5 s (Observable RxJS converti en signal). */
  private readonly indexRotation = toSignal(
    interval(5000).pipe(map((tick) => tick + 1)),
    { initialValue: 0 }
  );

  /** Plat du jour : tiré des plats disponibles, change automatiquement toutes les 5 s. */
  readonly platDuJour = computed<Plat | null>(() => {
    const disponibles = this.plats().filter((p) => p.disponible);
    if (disponibles.length === 0) {
      return null;
    }
    return disponibles[this.indexRotation() % disponibles.length];
  });

  /** Change la catégorie affichée (mutation via set()). */
  choisirCategorie(categorie: FiltreCategorie): void {
    this._categorie.set(categorie);
  }

  /** Met à jour le terme de recherche (mutation via set()). */
  rechercher(terme: string): void {
    this._recherche.set(terme);
  }
}
