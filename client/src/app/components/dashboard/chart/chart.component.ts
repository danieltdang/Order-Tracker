import { Component, OnInit, Inject, Input, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
  data: any;
  options: any;
  // Labels are dynamically generated in Dashboard
  private _labels: string[] | undefined;
  private _chartData: any[] | undefined;

  @Output() labelsChange = new EventEmitter<string[] | undefined>();
  @Output() chartDataChange = new EventEmitter<number[][] | undefined>();

  // Proper getters and setters to intercept and emit changes
  @Input()
  get labels(): string[] | undefined {
    return this._labels;
  }
  set labels(val: string[] | undefined) {
    this._labels = val;
    this.labelsChange.emit(this._labels);
  }

  @Input()
  get chartData(): number[][] | undefined {
    return this._chartData;
  }
  set chartData(val: number[][] | undefined) {
    this._chartData = val;
    this.chartDataChange.emit(this._chartData);
  }

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

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--surface-900');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      console.log(this.labels);
      console.log(this.chartData);

      this.data = {
          labels: this.labels,
          datasets: [
            {
              label: 'Orders',
              data: this.chartData?.[0] ?? [],
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              backgroundColor: documentStyle.getPropertyValue('--blue-500'),
            },
            {
              label: 'Preparing',
              data: this.chartData?.[1] ?? [],
              borderColor: documentStyle.getPropertyValue('--orange-500'),
              backgroundColor: documentStyle.getPropertyValue('--orange-500'),
            },
            {
              label: 'Shipping',
              data: this.chartData?.[2] ?? [],
              borderColor: documentStyle.getPropertyValue('--yellow-500'),
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
            },
            {
              label: 'Delivered',
              data: this.chartData?.[3] ?? [],
              borderColor: documentStyle.getPropertyValue('--green-500'),
              backgroundColor: documentStyle.getPropertyValue('--green-500'),
            },
            {
              label: 'Returned',
              data: this.chartData?.[4] ?? [],
              borderColor: documentStyle.getPropertyValue('--red-500'),
              backgroundColor: documentStyle.getPropertyValue('--red-500'),
            },
          ]
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
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
