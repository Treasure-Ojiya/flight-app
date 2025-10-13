import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirportService } from '../../services/airportService/airport-service';
import {
  AirportList,
  APIResponseModel,
} from '../../model/interface-flight.model';

@Component({
  selector: 'app-airports',
  imports: [CommonModule],
  templateUrl: './airports.html',
  styleUrl: './airports.css',
})
export class Airports implements OnInit {
  airportService = inject(AirportService);

  ngOnInit(): void {
    this.getAirports();
  }

  airportList: AirportList[] = [];
  pageBreak = 5;
  startPage = 1;

  getAirports() {
    this.airportService.getAllAirports().subscribe({
      next: (res: APIResponseModel) => {
        this.airportList = [...res.data];
      },
      error: (err) => {
        console.log('Error:', err);
      },
    });
  }

  get airports() {
    const begin = (this.startPage - 1) * this.pageBreak;
    return this.airportList.slice(begin, begin + this.pageBreak);
  }

  get totalPages() {
    return Math.ceil(this.airportList.length / this.pageBreak);
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
