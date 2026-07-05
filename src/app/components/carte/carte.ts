import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MenuService } from '../../services/menu';
import { Plat } from '../../models/plat';
import { Restaurant } from '../../models/restaurant';

/** Affiche la carte du restaurant : plat du jour, filtres et liste des plats. */
@Component({
  selector: 'app-carte',
  imports: [CurrencyPipe],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte {
  /** Couche de données injectée avec inject() (aucune injection par constructeur). */
  protected readonly menuService = inject(MenuService);

  /** Restaurants référencés en haut de page, pour localiser chaque plat. */
  restaurants = input.required<Restaurant[]>();

  /** Plat actuellement déplié (null = aucun). */
  protected readonly platSelectionne = signal<Plat | null>(null);

  /** Restaurants qui proposent le plat sélectionné. */
  protected readonly restaurantsDuPlat = computed<Restaurant[]>(() => {
    const plat = this.platSelectionne();
    if (!plat) {
      return [];
    }
    const ids = new Set(plat.restaurantIds);
    return this.restaurants().filter((resto) => ids.has(resto.id));
  });

  /** Ouvre le détail d'un plat, ou le referme s'il est déjà ouvert. */
  protected basculer(plat: Plat): void {
    this.platSelectionne.update((courant) =>
      courant?.id === plat.id ? null : plat
    );
  }
}
