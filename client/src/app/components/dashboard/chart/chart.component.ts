import { Component, OnInit, Inject, Input, Output, EventEmitter, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit, OnChanges {
  data: any;
  options: any;
  // Labels are dynamically generated in Dashboard
  private _labels: string[] | undefined;
  private _chartData: any[] | undefined;

  @Output() chartLabelsChange = new EventEmitter<string[] | undefined>();
  @Output() chartDataChange = new EventEmitter<number[][] | undefined>();

  // Proper getters and setters to intercept and emit changes
  @Input()
  get chartLabels(): string[] | undefined {
    return this._labels;
  }
  set chartLabels(val: string[] | undefined) {
    this._labels = val;
    this.chartLabelsChange.emit(this._labels);
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
  
  updateChartData() {
    //console.log(this.chartData);
    const documentStyle = getComputedStyle(document.documentElement);
  
    const datasets = [
      { label: 'Orders', borderColorVar: '--blue-500', backgroundColorVar: '--blue-500' },
      { label: 'Emails', borderColorVar: '--purple-500', backgroundColorVar: '--purple-500' },
      { label: 'Preparing', borderColorVar: '--orange-500', backgroundColorVar: '--orange-500' },
      { label: 'Shipping', borderColorVar: '--yellow-500', backgroundColorVar: '--yellow-500' },
      { label: 'Delivered', borderColorVar: '--green-500', backgroundColorVar: '--green-500' },
      { label: 'Returned', borderColorVar: '--red-500', backgroundColorVar: '--red-500' },
    ];
  
    // Prepare datasets with styles and data
    let updatedDatasets = datasets.map((dataset, index) => ({
      label: dataset.label,
      data: this.chartData?.[index] ?? [],
      borderColor: documentStyle.getPropertyValue(dataset.borderColorVar),
      backgroundColor: documentStyle.getPropertyValue(dataset.backgroundColorVar),
    }));

    // Identify columns to keep (non-zero in any dataset)
    const columnsToKeep = new Set();
    updatedDatasets.forEach(dataset => {
      dataset.data.forEach((value, index) => {
        if (value !== 0) columnsToKeep.add(index);
      });
    });

    // Filter datasets to keep only the necessary columns
    updatedDatasets = updatedDatasets.map(dataset => ({
      ...dataset,
      data: dataset.data.filter((_, index) => columnsToKeep.has(index))
    }));

    // Update labels to keep only the necessary columns
    const updatedLabels = this.chartLabels?.filter((_, index) => columnsToKeep.has(index));

    this.data = {
      labels: updatedLabels,
      datasets: updatedDatasets
    };

    //console.log(this.data);
  }
  
  
  

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

      this.updateChartData();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartLabels'] || changes['chartData']) {
      if (isPlatformBrowser(this.platformId)) {
        this.updateChartData();
      }
    }
  }
}
