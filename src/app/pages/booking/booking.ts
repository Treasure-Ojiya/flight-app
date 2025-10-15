import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flightService/flight-service';
import { BookingService } from '../../services/bookingService/booking-service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-booking',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private bookingService = inject(BookingService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private flightService = inject(FlightService);

  bookingForm!: FormGroup;
  flightId!: number;
  userId!: number;
  initialFare = 0;
  bookingSuccess = false;

  ngOnInit(): void {
    // Get flightId from route
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));

    // Get userId from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      this.userId = JSON.parse(user).userId;
    }

    // Initialize booking form (single traveler)
    this.bookingForm = this.formBuilder.group({
      flightId: [this.flightId],
      customerId: [this.userId],
      bookingDate: [new Date().toISOString()],
      totalAmount: [0],
      travelerName: ['', Validators.required],
      contactNo: ['', Validators.required],
      aadharNo: ['', Validators.required],
      seatNo: [0, Validators.required],
    });

    // Get flight fare
    this.flightService.getAllFlights().subscribe((res: any) => {
      const flight = res.data.find((f: any) => f.flightId === this.flightId);
      if (flight) {
        this.initialFare = flight.price;
        this.bookingForm.patchValue({ totalAmount: flight.price });
      }
    });
  }

  // === SUBMIT BOOKING ===
  onSubmit(): void {
    if (!this.bookingForm.valid) {
      alert('Please complete all traveler details.');
      return;
    }

    const formValue = this.bookingForm.value;

    const payload = {
      flightId: Number(formValue.flightId),
      customerId: Number(formValue.customerId),
      bookingDate: new Date(formValue.bookingDate).toISOString(),
      totalAmount: Number(formValue.totalAmount),
      FlightBookingTravelers: [
        {
          travelerName: formValue.travelerName.trim(),
          contactNo: formValue.contactNo.trim(),
          aadharNo: formValue.aadharNo.trim(),
          seatNo: Number(formValue.seatNo),
        },
      ],
    };

    console.log('✅ Final Payload Sent:', payload);

    this.bookingService.bookticket(payload).subscribe({
      next: (res: any) => {
        console.log('✅ API Response:', res);

        if (res?.result) {
          this.bookingSuccess = true;
          alert(res.message || 'Booking Successful');
          this.generateBookingTicket(payload);

          this.bookingForm.reset({
            flightId: this.flightId,
            customerId: this.userId,
            bookingDate: new Date().toISOString(),
            totalAmount: this.initialFare,
            seatNo: 0,
          });
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

  // === PDF GENERATION ===
  generateBookingTicket(payload: any): void {
    const doc = new jsPDF('p', 'mm', 'a4');

    const {
      flightId,
      customerId,
      bookingDate,
      totalAmount,
      FlightBookingTravelers,
    } = payload;

    const traveler = FlightBookingTravelers[0];

    // HEADER
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Skyline E-Ticket Confirmation', 15, 17);

    // FLIGHT SECTION
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
    doc.text(`Total Amount: ₦${totalAmount}`, 15, 95);

    // TRAVELER SECTION
    doc.setFont('helvetica', 'bold');
    doc.text('Traveler Details', 110, 40);
    doc.setFont('helvetica', 'normal');

    doc.setDrawColor(0, 102, 204);
    doc.rect(108, 45, 90, 90);

    let y = 55;
    doc.text(`Name: ${traveler.travelerName}`, 112, y);
    y += 8;
    doc.text(`Contact: ${traveler.contactNo}`, 112, y);
    y += 8;
    doc.text(`National ID: ${traveler.aadharNo}`, 112, y);
    y += 8;
    doc.text(`Seat No: ${traveler.seatNo}`, 112, y);

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

    doc.save(`Skyline_Eticket_${flightId}.pdf`);
  }
}
