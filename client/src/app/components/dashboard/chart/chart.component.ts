import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponentComponent implements OnInit {
  data: any;
  options: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Append '4d' to the colors (alpha channel), except for the hovered index
      function handleHover(evt: any, item: any, legend: any) {
        legend.chart.data.datasets.forEach((dataset: any) => {
          if (dataset.label !== item.text) {
            dataset.backgroundColor = dataset.backgroundColor + '4D';
          }
        });

        legend.chart.update();
      }

      // Removes the alpha channel from background colors
      function handleLeave(evt: any, item: any, legend: any) {
        legend.chart.data.datasets.forEach((dataset: any) => {
          if (dataset.label !== item.text) {
            dataset.backgroundColor = dataset.backgroundColor.slice(0, -2);
          }
        });

        legend.chart.update();
      }

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

      const randomData = generateRandomData(5, 6);

      const documentStyle = getComputedStyle(document.documentElement); // ERROR ReferenceError: getComputedStyle is not defined at _ChartComponentComponent.ngAfterViewInit 
      const textColor = documentStyle.getPropertyValue('--surface-900');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.data = {
          labels: ['October', 'November', 'December', 'January', 'February', 'March'],
          datasets: [
            {
              label: 'Orders',
              data: randomData[0],
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            },
            {
              label: 'Preparing',
              data: randomData[1],
              backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            },
            {
              label: 'Shipping',
              data: randomData[2],
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
            },
            {
              label: 'Delivered',
              data: randomData[3],
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
            },
            {
              label: 'Returned',
              data: randomData[4],
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
            },
          ]
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          title: {
            display: true,
            text: 'Order Tracker',
            color: textColor,
            font: {
              size: 20,
              weight: 600,
            },
            padding: {
              top: 0,
              bottom: 15
            },
          },
          legend: {
            position: 'bottom',
            labels: {
              color: textColor
            },
            onHover: handleHover,
            onLeave: handleLeave
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
}
