import { Component } from '@angular/core';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})
export class PreguntasComponent {
  public isOpen: { [key: string]: boolean } = {};
  
  public preguntas = [
    { pregunta: "Qué tipos de cursos ofrece Minotech", respuesta: "Ofrecemos una amplia variedad de cursos en tecnología, programación, diseño web, y más." },
    { pregunta: "Cómo puedo inscribirme en un curso", respuesta: "Puedes inscribirte a través de nuestra página web seleccionando el curso de tu interés y completando el proceso de inscripción." },
    // Añade más preguntas y respuestas según sea necesario
  ];

  toggleAnswer(questionId: string): void {
    this.isOpen[questionId] = !this.isOpen[questionId];
  }
}
