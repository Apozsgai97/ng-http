import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

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
  userPlaces = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  
  ngOnInit() {
      this.isFetching.set(true);
      const subscription = this.httpClient
        .get<{ places: Place[] }>('http://localhost:3000/user-places')
        .pipe(map((resData) => resData.places))
        .subscribe({
          next: (places) => {
            this.userPlaces.set(places);
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
