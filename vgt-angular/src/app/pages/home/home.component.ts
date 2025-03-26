import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  nowPlayingData: any = null;
  hoursPlayed: number = 0;
  minutesPlayed: number = 0;
  notes: string = '';
  backgroundImage: string = '';
  gameId: number = 0;

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any) {
    registerSwiperElements();
  }

  ngOnInit(): void {
    this.getNowPlaying();
  }

  getNowPlaying(): void {
    const apiUrl = 'http://localhost:8084/api/diary/now-playing';
    // const apiUrl = 'http://localhost:8080/api/diary/now-playing';

    // Ambil userId dan token dari sessionStorage
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('authToken');

    if (!userId || !token) {
      console.error('User ID atau Token tidak ditemukan di sessionStorage.');
      return;
    }

    const requestBody = { userId: userId};
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post(apiUrl, requestBody, { headers })
      .subscribe(
        (response: any) => {
          console.log('API Response:', response);
          this.nowPlayingData = response;

          if (response?.data?.length > 0) {
            const game = response.data[0];
            this.hoursPlayed = game.hoursPlayed;
            this.minutesPlayed = game.minutesPlayed;
            this.notes = game.text;
            this.backgroundImage = "https://" + game.gameCover;
            this.gameId = game.gameId;
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
      const activeIndex = swiperInstance.snapIndex ?? 0;
      console.log("Slide changed! Active index:", activeIndex);

      if (this.nowPlayingData?.data?.length > 0) {
          const newBg = this.nowPlayingData.data[activeIndex]?.gameCover;
          if (newBg) {
              this.backgroundImage = `https://${newBg}`;
              console.log("Updated Background Image:", this.backgroundImage);
          }
          this.gameId = this.nowPlayingData.data[activeIndex]?.gameId;
      }
  }
}
