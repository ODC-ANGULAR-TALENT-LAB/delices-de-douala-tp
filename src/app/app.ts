import { Component, computed, signal } from '@angular/core';
import { Header } from './components/header/header';
import { RestaurantList } from './components/restaurant-list/restaurant-list';
import { RatingChange, Restaurant } from './models/restaurant';

@Component({
  selector: 'app-root',
  imports: [Header, RestaurantList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /** Source de vérité : les 6 restaurants imposés. */
  protected readonly restaurants = signal<Restaurant[]>([
    { id: 1, name: 'Le Calao Doré', district: 'Akwa',
      specialty: 'Ndolé aux crevettes', currentRating: 0 },
    { id: 2, name: 'Chez Madame Ngono', district: 'Bonapriso',
      specialty: 'Eru aux pieds de bœuf', currentRating: 0 },
    { id: 3, name: 'La Fourchette Camerounaise', district: 'Bonanjo',
      specialty: 'Poulet DG', currentRating: 0 },
    { id: 4, name: 'Saveurs du Wouri', district: 'Bonamoussadi',
      specialty: 'Poisson braisé', currentRating: 0 },
    { id: 5, name: "L'Akwa Gourmand", district: 'Akwa',
      specialty: 'Bobolo et sauce arachide', currentRating: 0 },
    { id: 6, name: 'Le Royal de Bali', district: 'Bali',
      specialty: 'Koki et plantain', currentRating: 0 }
  ]);

  /** Nombre de restaurants ayant reçu au moins une note. */
  protected readonly ratedCount = computed(
    () => this.restaurants().filter((r) => r.currentRating > 0).length
  );

  protected readonly totalCount = computed(() => this.restaurants().length);

  /** Moyenne des notes attribuées (restaurants notés uniquement). */
  protected readonly averageRating = computed(() => {
    const rated = this.restaurants().filter((r) => r.currentRating > 0);
    if (rated.length === 0) {
      return 0;
    }
    const sum = rated.reduce((total, r) => total + r.currentRating, 0);
    return sum / rated.length;
  });

  /** Met à jour la note du restaurant ciblé sans muter le tableau. */
  protected onRestaurantRated({ id, rating }: RatingChange): void {
    this.restaurants.update((restaurants) =>
      restaurants.map((r) =>
        r.id === id ? { ...r, currentRating: rating } : r
      )
    );
  }
}
