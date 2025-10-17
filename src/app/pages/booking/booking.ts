import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../services/flightService/flight-service';
import { BookingService } from '../../services/bookingService/booking-service';
import { AuthService } from '../../services/authService/auth-service';
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
  private authService = inject(AuthService);

  bookingForm!: FormGroup;
  flightId!: number;
  userId: number | null = null;
  initialFare!: number;
  bookingSuccess = false;
  bookingSummary: any = null;

  ngOnInit(): void {
    // --- Get flightId from route params
    this.flightId = Number(this.route.snapshot.paramMap.get('flightId'));
    this.initialFare = Number(this.route.snapshot.paramMap.get('price'));

    // --- Get userId from localStorage
    this.userId = this.authService.getUserId();

    console.log('Retrieved User ID:', this.userId); // Debug log
    console.log('Full User Data:', this.authService.getUser()); // Debug log

    this.initializeForm();
  }
  // --- Build booking form
  //   this.bookingForm = this.formBuilder.group({
  //     flightId: [this.flightId],
  //     customerId: [this.userId],
  //     bookingDate: [new Date().toISOString()],
  //     totalAmount: [0],
  //     FlightBookingTravelers: this.formBuilder.array([
  //       this.formBuilder.group({
  //         travelerName: ['', Validators.required],
  //         contactNo: ['', Validators.required],
  //         aadharNo: ['', Validators.required],
  //         seatNo: [0, Validators.required],
  //       }),
  //     ]),
  //   });

  //   // --- Get flight details (price)
  //   this.flightService.getAllFlights().subscribe((res: any) => {
  //     const flight = res.data.find((f: any) => f.flightId === this.flightId);
  //     if (flight) {
  //       this.initialFare = flight.price;
  //     }
  //   });

  //   // --- Add first traveler form
  //   this.addTraveler();
  // }

  // get travelers(): FormArray {
  //   return this.bookingForm.get('FlightBookingTravelers') as FormArray;
  // }

  // private createTraveler(): FormGroup {
  //   return this.formBuilder.group({
  //     travelerName: ['', Validators.required],
  //     contactNo: ['', Validators.required],
  //     aadharNo: ['', Validators.required],
  //     seatNo: [0, Validators.required],
  //   });
  // }

  // addTraveler(): void {
  //   const currentTraveler = this.travelers.at(this.travelers.length - 1);
  //   if (currentTraveler && currentTraveler.valid) {
  //     this.travelers.push(this.createTraveler());
  //     currentTraveler.reset();
  //   } else if (!currentTraveler) {
  //     this.travelers.push(this.createTraveler());
  //   }
  // }

  // // === SUBMIT BOOKING ===
  // onSubmit(): void {
  //   if (!this.bookingForm.valid) {
  //     alert('Please complete all traveler details.');
  //     return;
  //   }

  //   const formValue = this.bookingForm.value;

  //   // --- Clean and format payload before sending
  //   const payload = {
  //     flightId: Number(formValue.flightId),
  //     customerId: Number(formValue.customerId),
  //     bookingDate: new Date(formValue.bookingDate).toISOString(),
  //     totalAmount: Number(formValue.totalAmount),
  //     FlightBookingTravelers: formValue.FlightBookingTravelers.filter(
  //       (t: any) => t.travelerName && t.contactNo && t.aadharNo
  //     ).map((t: any) => ({
  //       travelerName: t.travelerName.trim(),
  //       contactNo: t.contactNo.trim(),
  //       aadharNo: t.aadharNo.trim(),
  //       seatNo: Number(t.seatNo),
  //     })),
  //   };

  //   console.log('✅ Final Payload Sent:', payload);

  //   this.bookingService.bookticket(payload).subscribe({
  //     next: (res: any) => {
  //       console.log('✅ API Response:', res);

  //       if (res?.result) {
  //         this.bookingSuccess = true;
  //         alert(res.message || 'Booking Successful');

  //         // Generate PDF *before* clearing form
  //         this.generateBookingTicket(payload);

  //         // Reset form after
  //         this.travelers.clear();
  //         this.addTraveler();
  //       } else {
  //         alert(res.message || 'Booking failed, please try again.');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Booking failed', err);
  //       alert('Error: ' + (err.message || 'Unknown error'));
  //     },
  //   });
  // }

  // // === PDF GENERATION ===
  // generateBookingTicket(payload: any): void {
  //   const doc = new jsPDF('p', 'mm', 'a4');

  //   const {
  //     flightId,
  //     customerId,
  //     bookingDate,
  //     totalAmount,
  //     FlightBookingTravelers,
  //   } = payload;

  //   // HEADER
  //   doc.setFillColor(0, 102, 204);
  //   doc.rect(0, 0, 210, 25, 'F');
  //   doc.setTextColor(255, 255, 255);
  //   doc.setFontSize(18);
  //   doc.text('Skyline E-Ticket Confirmation', 15, 17);

  //   // FLIGHT DETAILS
  //   doc.setTextColor(0, 0, 0);
  //   doc.setFontSize(12);
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Flight Details', 15, 40);
  //   doc.setFont('helvetica', 'normal');
  //   doc.setDrawColor(0, 102, 204);
  //   doc.rect(12, 45, 85, 70);

  //   doc.text(`Flight ID: ${flightId}`, 15, 55);
  //   doc.text(`Customer ID: ${customerId}`, 15, 65);
  //   doc.text(`Booking Date:`, 15, 75);
  //   doc.text(new Date(bookingDate).toLocaleString(), 20, 82);
  //   doc.text(`Total Amount: NGN${totalAmount}`, 15, 95);

  //   // TRAVELERS SECTION
  //   doc.setFont('helvetica', 'bold');
  //   doc.text('Traveler(s)', 110, 40);
  //   doc.setFont('helvetica', 'normal');
  //   doc.setDrawColor(0, 102, 204);
  //   doc.rect(108, 45, 90, 120);

  //   let y = 55;
  //   (FlightBookingTravelers || []).forEach((t: any, i: number) => {
  //     doc.setFont('helvetica', 'bold');
  //     doc.text(`Traveler ${i + 1}`, 112, y);
  //     doc.setFont('helvetica', 'normal');
  //     y += 8;
  //     doc.text(`Name: ${t.travelerName}`, 115, y);
  //     y += 7;
  //     doc.text(`Contact: ${t.contactNo}`, 115, y);
  //     y += 7;
  //     doc.text(`National ID: ${t.aadharNo}`, 115, y);
  //     y += 7;
  //     doc.text(`Seat No: ${t.seatNo}`, 115, y);
  //     y += 10;
  //   });

  //   // FOOTER
  //   doc.setFillColor(240, 240, 240);
  //   doc.rect(0, 270, 210, 27, 'F');
  //   doc.setFontSize(11);
  //   doc.setTextColor(60);
  //   doc.text(
  //     'Thank you for booking with Skyline. Have a pleasant journey!',
  //     15,
  //     280
  //   );
  //   doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 286);

  //   // BORDER
  //   doc.setDrawColor(0, 102, 204);
  //   doc.roundedRect(10, 10, 190, 260, 5, 5);

  //   // SAVE
  //   doc.save(`Skyline_Eticket_${flightId}.pdf`);
  // }

  private initializeForm(): void {
    this.bookingForm = this.formBuilder.group({
      flightId: [this.flightId, Validators.required],
      customerId: [this.userId, Validators.required], // This should now auto-fill
      bookingDate: [new Date().toISOString(), Validators.required],
      totalAmount: [this.initialFare, [Validators.required, Validators.min(0)]],
      FlightBookingTravelers: this.formBuilder.array([]),
    });

    // Add first traveler
    this.addTraveler();

    // Get flight details
    this.loadFlightDetails();
  }

  private loadFlightDetails(): void {
    this.flightService.getAllFlights().subscribe((res: any) => {
      if (res.isSuccess && res.data) {
        const flight = res.data.find((f: any) => f.flightId === this.flightId);
        if (flight) {
          this.initialFare = flight.price || flight.fare || 0;
          this.updateTotalAmount();
        }
      }
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
    this.bookingForm.patchValue({ totalAmount: total });
  }

  // Debug method to check form values
  checkFormValues(): void {
    console.log('Form Values:', this.bookingForm.value);
    console.log(
      'CustomerId Control:',
      this.bookingForm.get('customerId')?.value
    );
    console.log('Is Form Valid:', this.bookingForm.valid);
  }

  onSubmit(): void {
    // Debug before submit
    this.checkFormValues();

    if (!this.bookingForm.valid) {
      alert('Please complete all required fields.');
      return;
    }

    // Ensure customerId is set
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

  // ... rest of your PDF generation code remains the same
  // // === PDF GENERATION ===
  generateBookingTicket(payload: any): void {
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
