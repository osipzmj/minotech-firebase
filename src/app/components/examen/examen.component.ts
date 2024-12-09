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
  rol: 'estandar' | 'admin' | 'profesor' | null = null;
  nombre = '';

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursosService
  ) { }

  ngOnInit(): void {
    const cursoUid = this.route.snapshot.paramMap.get('cursoUid');
    if (cursoUid) {
      this.cursoService.getCursoByUid(cursoUid)
        .then(curso => {
          if (curso) {
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
      this.generarCertificado();
  }
  }

  async getDatosUser(uid: string) {
    const path = 'Usuarios';
    const fieldName = 'uid';
    const id = uid;
    try {
        const usuario = await this.cursoService.getDocumentByName<Usuario>(path,fieldName, id);
        if (usuario) {
            this.rol = usuario.rol;
            console.log(this.rol)
            this.nombre = usuario.nombre;
        } else {
            console.log("Usuario no encontrado");
            this.rol = null;
        }
    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        this.rol = null;
    }
  }

  generarCertificado() {
      const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
      });
      const encabezado = new Image();
      encabezado.src = 'assets/encabezado.jpg';
      encabezado.onload = () => {
          doc.addImage(encabezado, 'PNG', 0, 0, doc.internal.pageSize.getWidth(), 20);
      };
      const logo = new Image();
      logo.src = 'assets/logo3.png'; 
      logo.onload = () => {
          doc.addImage(logo, 'PNG', 20, 30, 50, 20); 
          const nombreEstudiante = this.nombre; 
          const nombreCurso = this.curso?.nombreCurso || "Nombre del Curso";
          const fecha = new Date().toLocaleDateString();
          doc.setFont('times', 'bold');
          doc.setFontSize(20);
          doc.setTextColor(128, 0, 128); 
          doc.text(`Certificado de Acreditación`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
          doc.setFont('times', 'italic');
          doc.setFontSize(12); 
          doc.setTextColor(0);
          const textWidth = doc.getStringUnitWidth(`Este certifica que ${nombreEstudiante}`) * 12;
          const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2; 
          const lineHeight = 10; 
          doc.text(`Este certifica que ${nombreEstudiante}`, textOffset, 100, { align: 'left' });
          doc.text(`ha completado satisfactoriamente el curso de`, textOffset, 100 + lineHeight, { align: 'left' });
          doc.text(`${nombreCurso}`, textOffset, 100 + 2 * lineHeight, { align: 'left' });
          doc.text(`Fecha de emisión: ${fecha}`, textOffset, 100 + 3 * lineHeight, { align: 'left' });
          doc.setLineWidth(0.5);
          doc.line(20, 150, doc.internal.pageSize.getWidth() - 20, 150);
          const firmaWidth = doc.getStringUnitWidth('ATENTAMENTE MINOTECH') * 12; 
          const firmaOffset = (doc.internal.pageSize.getWidth() - firmaWidth) / 2; 
          doc.text('ATENTAMENTE MINOTECH', firmaOffset, 160, { align: 'left' });

          doc.save(`Certificado_${nombreEstudiante}_${nombreCurso}.pdf`);
      };
  }
  

}