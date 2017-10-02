import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'megabytes'
})
export class MegabytePipe implements PipeTransform {
  transform(value: number): string {
    return (value / 1000000).toLocaleString([], {maximumFractionDigits: 2}) + ' MB';
  }
}
