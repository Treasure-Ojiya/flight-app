import { Component, inject, OnInit } from '@angular/core';
import { FlightService } from '../../services/flightService/flight-service';
import {
  FlightList,
  APIResponseModel,
} from '../../model/interface-flight.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flights',
  imports: [DatePipe],
  templateUrl: './flights.html',
  styleUrl: './flights.css',
})
export class Flights implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    this.getFlights();
  }
  flightService = inject(FlightService);

  flightList: FlightList[] = [];

  getFlights() {
    this.flightService.getAllFlights().subscribe({
      next: (res: APIResponseModel) => {
        this.flightList = [...res.data];
      },
      error() {
        console.log('FAILED TO FETCH');
      },
    });
  }

  bookFlight(flightId: number): void {
    this.router.navigate(['/booking', flightId]);
  }

  pageBreak = 5;

  startPage = 1;

  get flights() {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.flightList.slice(begin, begin + this.pageBreak);
  }

  get totalPages() {
    return Math.ceil(this.flightList.length / this.pageBreak);
  }

  changePage(increment: number) {
    this.startPage += increment;
  }

  get visiblePages() {
    const noOfPages = this.totalPages;
    const currentPage = this.startPage;
    const pagesToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let end = start + pagesToShow - 1;
    if (end > noOfPages) {
      end = noOfPages;
      start = end - pagesToShow + 1;
    }
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
