import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { SwiperContainer, register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { Router } from '@angular/router';
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
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollToTopBtn') scrollToTopBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('scrollToBottomBtn') scrollToBottomBtn!: ElementRef<HTMLButtonElement>;

  constructor(private router: Router) {}
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


  ngAfterViewInit(): void {
    this.scrollToTopBtn.nativeElement.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    this.scrollToBottomBtn.nativeElement.addEventListener("click", () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    });

    const toggleScrollButtons = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollPosition > windowHeight * 0.5) {
      this.scrollToBottomBtn.nativeElement.classList.remove("hide");
    } else {
      this.scrollToBottomBtn.nativeElement.classList.add("hide");
    }

    if (scrollPosition < windowHeight * 0.5) {
      this.scrollToTopBtn.nativeElement.classList.add("hide");
    } else {
      this.scrollToTopBtn.nativeElement.classList.remove("hide");
    }
  };

  toggleScrollButtons();
  window.addEventListener("scroll", toggleScrollButtons);
}

irACursos() {
  this.router.navigate(['/cursos']);
}

irARegistro() {
  this.router.navigate(['/registro']);
}

}