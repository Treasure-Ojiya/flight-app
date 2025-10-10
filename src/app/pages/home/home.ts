import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  backgroundImage = 'assets/imgs/city-aerial-view-1.jpg';
  backgroundSize = 'cover';
  backgroundPosition = 'center';
}
