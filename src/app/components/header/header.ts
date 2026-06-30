import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [DecimalPipe],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  /** Nombre de restaurants ayant reçu au moins une note. */
  ratedCount = input.required<number>();

  /** Nombre total de restaurants référencés. */
  totalCount = input.required<number>();

  /** Moyenne des notes attribuées. */
  averageRating = input.required<number>();
}
