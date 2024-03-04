import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrl: './chart-component.component.css'
})
export class ChartComponentComponent implements AfterViewInit {
  data: any;
  options: any;

  ngAfterViewInit() {
    function generateRandomData(numArrays: number, arrayLength: number): number[][] {
      const arrays: number[][] = [];
    
      for (let i = 0; i < numArrays; i++) {
        const arr: number[] = [];
        for (let j = 0; j < arrayLength; j++) {
          // Generate a random number between 0 and 40
          const randomNumber = Math.floor(Math.random() * 41);
          arr.push(randomNumber);
        }
        arrays.push(arr);
      }
    
      return arrays;
    }

    const randomData = generateRandomData(5, 7);

    const documentStyle = getComputedStyle(document.documentElement); // ERROR ReferenceError: getComputedStyle is not defined at _ChartComponentComponent.ngAfterViewInit 
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Orders',
            data: randomData[0],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0
          },
          {
            label: 'Preparing',
            data: randomData[1],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            tension: 0
          },
          {
            label: 'Shipping',
            data: randomData[2],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
            tension: 0
          },
          {
            label: 'Delivered',
            data: randomData[3],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--green-500'),
            tension: 0
          },
          {
            label: 'Returned',
            data: randomData[4],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--red-500'),
            tension: 0
          },
        ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: false,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
