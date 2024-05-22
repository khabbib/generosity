import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';

//Temporary
interface DonationData {
  project: string;
  totalDonations: number;
  numberOfDonors: number;
  percentageOfTotalFunds: number;
  percentageOfDonors: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

//Fake temporary Data
export class DashboardComponent implements OnInit {
  donationsData: DonationData[] = [
    { project: 'Project Mobi Study V2', totalDonations: 10000, numberOfDonors: 50, percentageOfTotalFunds: 40, percentageOfDonors: 40 },
    { project: 'Project improve Skånetrafiken', totalDonations: 15000, numberOfDonors: 75, percentageOfTotalFunds: 50, percentageOfDonors: 50 },
    { project: 'Project undermine Lunds university', totalDonations: 8000, numberOfDonors: 30, percentageOfTotalFunds: 10, percentageOfDonors: 10 }
  ];

  currentFrame: 'week' | 'month' | 'year' = 'week';
  barChart1?: Chart;
  barChart2?: Chart;
  pieChart1?: Chart;
  pieChart2?: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createCharts();
    this.loadChartData();
  }

  setTimeFrame(frame: 'week' | 'month' | 'year'): void {
    this.currentFrame = frame;
    this.updateCharts();
  }

  createCharts(): void {
    this.barChart1 = this.createChart('barChart1', 'bar', 'Total Donations (SEK)', this.getTotalDonations(), ['rgba(75, 192, 192, 0.2)'], ['rgba(75, 192, 192, 1)']);
    this.barChart2 = this.createChart('barChart2', 'bar', 'Number of Donors', this.getNumberOfDonors(), ['rgba(153, 102, 255, 0.2)'], ['rgba(153, 102, 255, 1)']);
    this.pieChart1 = this.createChart('pieChart1', 'pie', 'Percentage of Total Funds', this.getPercentageOfTotalFunds(), ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'], ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)']);
    this.pieChart2 = this.createChart('pieChart2', 'pie', 'Percentage of Donors', this.getPercentageOfDonors(), ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'], ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']);
  }

  createChart(elementId: string, chartType: ChartType, label: string, data: number[], backgroundColor: string[], borderColor: string[]): Chart {
    const ctx = document.getElementById(elementId) as HTMLCanvasElement;
    return new Chart(ctx, {
      type: chartType,
      data: {
        labels: this.getLabels(),
        datasets: [{
          label: label,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: chartType === 'bar' ? { y: { beginAtZero: true } } : undefined
      }
    });
  }

  updateCharts(): void {
    this.updateChart(this.barChart1, this.getTotalDonations());
    this.updateChart(this.barChart2, this.getNumberOfDonors());
    this.updateChart(this.pieChart1, this.getPercentageOfTotalFunds());
    this.updateChart(this.pieChart2, this.getPercentageOfDonors());
  }

  updateChart(chart: Chart | undefined, data: number[]): void {
    if (chart) {
      chart.data.datasets[0].data = data;
      chart.update();
    }
  }

  getLabels(): string[] {
    return this.donationsData.map(data => data.project);
  }

  getTotalDonations(): number[] {
    return this.donationsData.map(data => data.totalDonations);
  }

  getNumberOfDonors(): number[] {
    return this.donationsData.map(data => data.numberOfDonors);
  }

  getPercentageOfTotalFunds(): number[] {
    return this.donationsData.map(data => data.percentageOfTotalFunds);
  }

  getPercentageOfDonors(): number[] {
    return this.donationsData.map(data => data.percentageOfDonors);
  }

  saveChartData(): void {
    // Local storage so API isnt called everytime?
  }

  loadChartData(): void {
    // Local storage so API isnt called everytime?
  }
}
