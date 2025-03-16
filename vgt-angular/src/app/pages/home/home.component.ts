import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { register as registerSwiperElements } from 'swiper/element/bundle';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent implements OnInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  nowPlayingData: any = null;
  hoursPlayed: number = 0;
  minutesPlayed: number = 0;
  notes: string = '';
  backgroundImage: string = '';

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any) {
    registerSwiperElements();
  }

  ngOnInit(): void {
    this.getNowPlaying();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this.swiperContainer) {
      const swiperEl = this.swiperContainer.nativeElement;
      
      console.log("Swiper container found:", swiperEl);
      
      swiperEl.addEventListener('slidechange', (event: any) => {
        console.log("Slide change detected!");
        this.onSlideChange(event);
      });
    }
  }

  getNowPlaying(): void {
    const apiUrl = 'http://localhost:8084/api/diary/now-playing';
    const requestBody = { userId: 'ffdd26c6-7fef-4b69-9357-d8dbccaac212' };

    this.http.post(apiUrl, requestBody, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(
        (response: any) => {
          // console.log('API Response:', response);
          this.nowPlayingData = response;

          if (response?.data?.length > 0) {
            const game = response.data[0];
            this.hoursPlayed = game.hoursPlayed;
            this.minutesPlayed = game.minutesPlayed;
            this.notes = game.text;
            this.backgroundImage = "https://" + game.gameCover;
          }
        },
        (error) => {
          console.error('API Error:', error);
        }
      );
  }

  onSlideChange(event: any) {
      if (!event?.target?.swiper) {
          console.warn("Swiper instance belum siap!");
          return;
      }

      const swiperInstance = event.target.swiper;
      const activeIndex = swiperInstance.snapIndex ?? 0; // Gunakan snapIndex untuk menghindari error loop
      console.log("Slide changed! Active index:", activeIndex);

      if (this.nowPlayingData?.data?.length > 0) {
          const newBg = this.nowPlayingData.data[activeIndex]?.gameCover;
          if (newBg) {
              this.backgroundImage = `https://${newBg}`;
              console.log("Updated Background Image:", this.backgroundImage);
          }
      }
  }
}
