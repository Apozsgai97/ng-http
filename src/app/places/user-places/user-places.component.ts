import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);
  
  ngOnInit() {
      this.isFetching.set(true);
      const subscription = this.placesService.loadUserPlaces().subscribe({
          next: (places) => {
            this.places.set(places);
          },
          error: (error) => {
            console.error(error);
            this.error.set(
              'Something went wrong while fetching your favorite places. Please try again later.'
            );
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
