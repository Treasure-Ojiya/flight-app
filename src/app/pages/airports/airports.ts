import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../services/airportService/airport-service';

@Component({
  selector: 'app-airports',
  imports: [CommonModule],
  templateUrl: './airports.html',
  styleUrl: './airports.css',
})
export class Airports {
  private airportService = inject(AirportService);

  // airportList: AirportList[]=[]

  getAirports() {
    this.airportService.getAllAirports().subscribe({ next: (res) => {} });
  }
}
