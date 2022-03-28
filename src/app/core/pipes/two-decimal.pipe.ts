import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'twodecimalpipe'
})

export class TwoDecimalPipe implements PipeTransform {
  
  transform(seconds: number) {
    if(!seconds) {
      return '00';
    }
    console.log(seconds);
    const secondsString = seconds.toString()
    if(secondsString.length !== 2) {
      return '0' + secondsString
    }
    return seconds;
  }
}