import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Curso from 'src/app/interfaces/curso.interface';
import { CursosService } from 'src/app/services/cursos.service';
import { jsPDF } from 'jspdf';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit{
  curso: Curso | null = null;
  todasRespuestasContestadas = false;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService
  ) { }

  ngOnInit(): void {
    // Obtener el UID del curso desde la ruta
    const cursoUid = this.route.snapshot.paramMap.get('cursoUid');

    // Obtener el curso por UID
    if (cursoUid) {
      this.cursoService.getCursoByUid(cursoUid)
        .then(curso => {
          if (curso) {
            // Asignar el curso obtenido para mostrar en el HTML
            this.curso = curso;
          } else {
            console.log("No se encontró el curso con el UID proporcionado.");
          }
        })
        .catch(error => {
          console.error("Error al obtener los datos del curso:", error);
        });
    } else {
      console.log("No se proporcionó un UID de curso válido en la URL");
    }
  }

  verificarRespuestas() {
    this.todasRespuestasContestadas = !!this.curso;
    if (this.todasRespuestasContestadas) {
      // Generar el PDF
      this.generarCertificado();
  }
  }


  generarCertificado() {
      // Crear un nuevo documento PDF con orientación horizontal y margen
      const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4', // Tamaño A4
      });
  
      // Agregar la imagen del encabezado
      const encabezado = new Image();
      encabezado.src = 'assets/encabezado.jpg'; // Especifica la ruta relativa a la imagen del encabezado
      encabezado.onload = () => {
          doc.addImage(encabezado, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), 20); // Agrega la imagen como encabezado
      };
  
      // Agregar el logo de la empresa
      const logo = new Image();
      logo.src = 'assets/logo3.png'; // Especifica la ruta relativa a la imagen del logo
      logo.onload = () => {
          doc.addImage(logo, 'PNG', 20, 30, 50, 20); // Ajusta las coordenadas y el tamaño según sea necesario
  
          // Personalizar el contenido del certificado
          const nombreEstudiante = "Juan Pérez"; // Aquí deberías obtener el nombre del estudiante desde alguna fuente de datos
          const nombreCurso = this.curso?.nombreCurso || "Nombre del Curso";
          const fecha = new Date().toLocaleDateString();
  
          // Establecer estilos
          doc.setFont('times', 'bold'); // Tipo de letra y estilo
          doc.setFontSize(20); // Tamaño de la fuente del título
          doc.setTextColor(128, 0, 128); // Color del título (morado)
  
          // Agregar el título al PDF
          doc.text(`Certificado de Acreditación`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  
          doc.setFont('times', 'italic'); // Establecer el estilo de fuente itálica
          doc.setFontSize(12); // Tamaño de la fuente normal
          doc.setTextColor(0); // Restaurar el color de texto predeterminado (negro)
  
          // Centrar el contenido
          const textWidth = doc.getStringUnitWidth(`Este certifica que ${nombreEstudiante}`) * 12; // Ancho del texto
          const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2; // Offset para centrar
          const lineHeight = 10; // Altura de línea
  
          // Agregar el contenido al PDF centrado
          doc.text(`Este certifica que ${nombreEstudiante}`, textOffset, 100, { align: 'left' });
          doc.text(`ha completado satisfactoriamente el curso de`, textOffset, 100 + lineHeight, { align: 'left' });
          doc.text(`${nombreCurso}`, textOffset, 100 + 2 * lineHeight, { align: 'left' });
          doc.text(`Fecha de emisión: ${fecha}`, textOffset, 100 + 3 * lineHeight, { align: 'left' });
  
          // Agregar línea para la firma ficticia
          doc.setLineWidth(0.5);
          doc.line(20, 150, doc.internal.pageSize.getWidth() - 20, 150); // Línea para la firma
  
          // Agregar firma ficticia centrada
          const firmaWidth = doc.getStringUnitWidth('ATENTAMENTE MINOTECH') * 12; // Ancho de la firma
          const firmaOffset = (doc.internal.pageSize.getWidth() - firmaWidth) / 2; // Offset para centrar la firma
          doc.text('ATENTAMENTE MINOTECH', firmaOffset, 160, { align: 'left' });
  
          // Guardar el PDF
          doc.save(`Certificado_${nombreEstudiante}_${nombreCurso}.pdf`);
      };
  }
  

}