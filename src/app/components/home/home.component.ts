import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, signal } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
register();

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./home.component.css',
],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('1s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit{

  constructor() {}
  swiperElements = signal<SwiperContainer | null>(null);

  ngOnInit(): void {
    const swiperElemConstructor = document.querySelector('swiper-container');
    const swiperOptions: SwiperOptions = {
      slidesPerView: "auto",
      centeredSlides: true,
      breakpoints: {
        430: {
          slidesPerView: 1
        },
        800:{
          slidesPerView: 2
        }
      },
      autoplay: 
      {
        delay: 3000
      },
         effect: "coverflow",
      grabCursor: true,
      coverflowEffect: {
        rotate: 10,
        stretch: 0,
        modifier: 1,
        slideShadows: true
    }
    }
    Object.assign(swiperElemConstructor!, swiperOptions);
    this.swiperElements.set(swiperElemConstructor as SwiperContainer);
    this.swiperElements()?.initialize();
  }

  ngAfterViewInit() {

  }
  // private initSwiper() {
  //   new Swiper(".swiper-container", {
  //     effect: "coverflow",
  //     grabCursor: true,
  //     centeredSlides: true,
  //     slidesPerView: "auto",
  //     coverflowEffect: {
  //       rotate: 10,
  //       stretch: 0,
  //       depth: 350,
  //       modifier: 1,
  //       slideShadows: true
  //     },
  //     direction: 'horizontal' // Ajustar la dirección del desplazamiento a horizontal
  //   });
  // }
 
}
