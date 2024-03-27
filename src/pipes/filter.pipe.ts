import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if (!arg || arg.length < 1) {
      return value;
    }

    const resultCurso = [];
    const searchTerm = arg.toLowerCase();

    for (const curso of value) {
      if (curso.nombreCurso.toLowerCase().includes(searchTerm)) {
        resultCurso.push(curso);
      }
    }
    
    return resultCurso;
  }
}