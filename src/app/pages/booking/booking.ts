import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../services/flightService/flight-service';
import { BookingService } from '../../services/bookingService/booking-service';

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private bookingService = inject(BookingService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private flightService = inject(FlightService);

  bookingForm!: FormGroup;
  flightId!: number;
  userId!: number;
  initialFare: number = 0;

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));

    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).userId;
    }

    this.bookingForm = this.formBuilder.group({
      flightId: [this.flightId],
      customerId: [this.userId],
      bookingDate: [new Date().toISOString()],
      totalAmount: [0],
      FlightBookingTravelers: this.formBuilder.array([]),
    });

    this.flightService.getAllFlights().subscribe((res: any) => {
      const flight = res.data.find((f: any) => f.flightId === this.flightId);
      if (flight) {
        this.initialFare = flight.price;
        this.updateTotalAmount();
      }
    });

    this.addTraveler(); // Initialize with one traveler form
  }

  get travelers(): FormArray {
    return this.bookingForm.get('FlightBookingTravelers') as FormArray;
  }

  addTraveler(): void {
    const currentTraveler = this.travelers.at(this.travelers.length - 1);

    if (currentTraveler && currentTraveler.valid) {
      this.travelers.push(
        this.formBuilder.group({
          travelerName: ['', Validators.required],
          contactNo: ['', Validators.required],
          aadharNo: ['', Validators.required],
          seatNo: [0, Validators.required],
        })
      );
      this.updateTotalAmount();

      currentTraveler.reset();
    } else if (!currentTraveler) {
      this.travelers.push(
        this.formBuilder.group({
          travelerName: ['', Validators.required],
          contactNo: ['', Validators.required],
          aadharNo: ['', Validators.required],
          seatNo: [0, Validators.required],
        })
      );
    }
  }

  removeTraveler(index: number): void {
    this.travelers.removeAt(index);
    this.updateTotalAmount();
  }

  updateTotalAmount(): void {
    const seatCount = this.travelers.length;
    const total = seatCount * this.initialFare;
    this.bookingForm.patchValue({ totalAmount: total });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.bookingService.bookticket(this.bookingForm.value).subscribe({
        next: (res: any) => {
          alert('Booking Successful');
          this.travelers.clear();
          this.addTraveler();
        },
        error: (err) => {
          console.error('Booking failed', err);
        },
      });
    }
  }
}
