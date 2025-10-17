import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flightService/flight-service';
import { BookingService } from '../../services/bookingService/booking-service';
import { AuthService } from '../../services/authService/auth-service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private bookingService = inject(BookingService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private flightService = inject(FlightService);
  private authService = inject(AuthService);

  bookingForm!: FormGroup;
  flightId!: number;
  userId: number | null = null;
  initialFare: number = 0; // Initialize with 0
  bookingSuccess = false;
  bookingSummary: any = null;
  flightData: any = null; // Store flight data

  ngOnInit(): void {
    // --- Get flightId from route params
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.userId = this.authService.getUserId();

    console.log('Retrieved User ID:', this.userId);
    console.log('Flight ID:', this.flightId);

    // Initialize form first with default values
    this.initializeForm();

    // Then load flight details to update the price
    this.loadFlightDetails();
  }

  private initializeForm(): void {
    this.bookingForm = this.formBuilder.group({
      flightId: [this.flightId, Validators.required],
      customerId: [this.userId, Validators.required],
      bookingDate: [new Date().toISOString(), Validators.required],
      totalAmount: [0], // Start with 0
      FlightBookingTravelers: this.formBuilder.array([]),
    });

    // Add first traveler
    this.addTraveler();
  }

  private loadFlightDetails(): void {
    this.flightService.getAllFlights().subscribe({
      next: (res: any) => {
        console.log('Flight API Response:', res); // Debug log
        if (res.isSuccess && res.data) {
          const flight = res.data.find(
            (f: any) => f.flightId === this.flightId
          );
          console.log('Found Flight:', flight); // Debug log

          if (flight) {
            this.flightData = flight;
            this.initialFare = flight.price;
            console.log('Initial Fare Set To:', this.initialFare); // Debug log

            // Update the total amount with the actual price
            this.updateTotalAmount();
          } else {
            console.error('Flight not found with ID:', this.flightId);
          }
        }
      },
      error: (err) => {
        console.error('Error loading flight details:', err);
      },
    });
  }

  get travelers(): FormArray {
    return this.bookingForm.get('FlightBookingTravelers') as FormArray;
  }

  private createTraveler(): FormGroup {
    return this.formBuilder.group({
      travelerName: ['', [Validators.required, Validators.minLength(2)]],
      contactNo: [
        '',
        [Validators.required, Validators.pattern(/^[0-9+\-() ]+$/)],
      ],
      aadharNo: ['', [Validators.required, Validators.minLength(5)]],
      seatNo: [0, [Validators.required, Validators.min(1)]],
    });
  }

  addTraveler(): void {
    this.travelers.push(this.createTraveler());
    this.updateTotalAmount();
  }

  removeTraveler(index: number): void {
    if (this.travelers.length > 1) {
      this.travelers.removeAt(index);
      this.updateTotalAmount();
    }
  }

  updateTotalAmount(): void {
    const seatCount = this.travelers.length;
    const total = seatCount * this.initialFare;
    console.log('Updating Total Amount:', {
      seatCount,
      initialFare: this.initialFare,
      total,
    }); // Debug log

    this.bookingForm.patchValue(
      {
        totalAmount: total,
      },
      { emitEvent: true }
    );
  }

  // Debug method to check form values
  checkFormValues(): void {
    console.log('Form Values:', this.bookingForm.value);
    console.log(
      'CustomerId Control:',
      this.bookingForm.get('customerId')?.value
    );
    console.log(
      'Total Amount Control:',
      this.bookingForm.get('totalAmount')?.value
    );
    console.log('Initial Fare:', this.initialFare);
    console.log('Is Form Valid:', this.bookingForm.valid);
  }

  onSubmit(): void {
    this.checkFormValues();

    if (!this.bookingForm.valid) {
      alert('Please complete all required fields.');
      return;
    }

    if (!this.bookingForm.get('customerId')?.value) {
      alert('Customer ID is missing. Please log in again.');
      return;
    }

    const formValue = this.bookingForm.value;

    const payload = {
      flightId: Number(formValue.flightId),
      customerId: Number(formValue.customerId),
      bookingDate: new Date(formValue.bookingDate).toISOString(),
      totalAmount: Number(formValue.totalAmount),
      FlightBookingTravelers: formValue.FlightBookingTravelers.map(
        (t: any) => ({
          travelerName: t.travelerName?.trim() || '',
          contactNo: t.contactNo?.trim() || '',
          aadharNo: t.aadharNo?.trim() || '',
          seatNo: Number(t.seatNo) || 0,
        })
      ),
    };

    console.log('Final Payload:', payload);

    this.bookingService.bookticket(payload).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res?.result) {
          this.bookingSuccess = true;
          alert(res.message || 'Booking Successful');
          this.generateBookingTicket(payload);
          this.travelers.clear();
          this.addTraveler();
        } else {
          alert(res.message || 'Booking failed, please try again.');
        }
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('Error: ' + (err.message || 'Unknown error'));
      },
    });
  }

  // Display flight price in template (optional)
  get flightPrice(): number {
    return this.initialFare;
  }

  // ... rest of your PDF generation code remains the same
  generateBookingTicket(payload: any): void {
    // Your existing PDF code
    const doc = new jsPDF('p', 'mm', 'a4');

    const {
      flightId,
      customerId,
      bookingDate,
      totalAmount,
      FlightBookingTravelers,
    } = payload;

    // HEADER
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Skyline E-Ticket Confirmation', 15, 17);

    // FLIGHT DETAILS
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Details', 15, 40);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(0, 102, 204);
    doc.rect(12, 45, 85, 70);

    doc.text(`Flight ID: ${flightId}`, 15, 55);
    doc.text(`Customer ID: ${customerId}`, 15, 65);
    doc.text(`Booking Date:`, 15, 75);
    doc.text(new Date(bookingDate).toLocaleString(), 20, 82);
    doc.text(`Total Amount: NGN${totalAmount}`, 15, 95);

    // TRAVELERS SECTION
    doc.setFont('helvetica', 'bold');
    doc.text('Traveler(s)', 110, 40);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(0, 102, 204);
    doc.rect(108, 45, 90, 120);

    let y = 55;
    (FlightBookingTravelers || []).forEach((t: any, i: number) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Traveler ${i + 1}`, 112, y);
      doc.setFont('helvetica', 'normal');
      y += 8;
      doc.text(`Name: ${t.travelerName}`, 115, y);
      y += 7;
      doc.text(`Contact: ${t.contactNo}`, 115, y);
      y += 7;
      doc.text(`National ID: ${t.aadharNo}`, 115, y);
      y += 7;
      doc.text(`Seat No: ${t.seatNo}`, 115, y);
      y += 10;
    });

    // FOOTER
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(
      'Thank you for booking with Skyline. Have a pleasant journey!',
      15,
      280
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 286);

    // BORDER
    doc.setDrawColor(0, 102, 204);
    doc.roundedRect(10, 10, 190, 260, 5, 5);

    // SAVE
    doc.save(`Skyline_Eticket_${flightId}.pdf`);
  }
}
