import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import SupabaseService from '../shared/supabaseDB';

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
export class DashboardComponent implements OnInit {
  donationsData: DonationData[] = [];
  currentFrame: 'week' | 'month' | 'year' = 'week';
  barChart1?: Chart;
  barChart2?: Chart;
  pieChart1?: Chart;
  pieChart2?: Chart;

  constructor(private supabaseService: SupabaseService) {
    Chart.register(...registerables);
  }

  async ngOnInit(): Promise<void> {
    await this.loadInitialData(); 
    this.createCharts();
  }

  async loadInitialData(): Promise<void> {
    console.log("Initial load - Clearing local storage and fetching data from DB.");
    this.clearLocalStorage();
    try {
      const allData = await this.supabaseService.getAllPayments();
      localStorage.setItem('allPaymentsData', JSON.stringify(allData));
      this.filterAndSetDonationData();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  filterAndSetDonationData(): void {
    const allData = JSON.parse(localStorage.getItem('allPaymentsData') || '[]');
    this.donationsData = this.supabaseService.filterPaymentsByTimeFrame(allData, this.currentFrame);
    console.log(`Filtered donationsData for ${this.currentFrame}: `, this.donationsData);
    this.updateCharts();
  }

  async setTimeFrame(frame: 'week' | 'month' | 'year'): Promise<void> {
    this.currentFrame = frame;
    this.filterAndSetDonationData(); 
  }

  createCharts(): void {
    if (!this.barChart1) {
      this.barChart1 = this.createChart(
        'barChart1',
        'bar',
        'Total Donations (SEK)',
        this.getTotalDonations(),
        this.getColorArray('backgroundColor'),
        this.getColorArray('borderColor')
      );
    }

    if (!this.barChart2) {
      this.barChart2 = this.createChart(
        'barChart2',
        'bar',
        'Number of Donors',
        this.getNumberOfDonors(),
        this.getColorArray('backgroundColor'),
        this.getColorArray('borderColor')
      );
    }

    if (!this.pieChart1) {
      this.pieChart1 = this.createChart(
        'pieChart1',
        'pie',
        'Percentage of Total Funds',
        this.getPercentageOfTotalFunds(),
        this.getColorArray('backgroundColor'),
        this.getColorArray('borderColor'),
        'Percentage of Total Funds'
      );
    }

    if (!this.pieChart2) {
      this.pieChart2 = this.createChart(
        'pieChart2',
        'pie',
        'Percentage of Donors',
        this.getPercentageOfDonors(),
        this.getColorArray('backgroundColor'),
        this.getColorArray('borderColor'),
        'Percentage of Donors'
      );
    }
  }

  createChart(elementId: string, chartType: ChartType, label: string, data: number[], backgroundColor: string[], borderColor: string[], title?: string): Chart {
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
        plugins: {
          title: {
            display: !!title,
            text: title
          }
        },
        scales: chartType === 'bar' ? { y: { beginAtZero: true } } : undefined
      }
    });
  }

  updateCharts(): void {
    if (this.barChart1) {
      this.updateChart(this.barChart1, this.getTotalDonations(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    } else {
      this.createCharts(); 
    }

    if (this.barChart2) {
      this.updateChart(this.barChart2, this.getNumberOfDonors(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    } else {
      this.createCharts();
    }

    if (this.pieChart1) {
      this.updateChart(this.pieChart1, this.getPercentageOfTotalFunds(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    } else {
      this.createCharts(); 
    }

    if (this.pieChart2) {
      this.updateChart(this.pieChart2, this.getPercentageOfDonors(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    } else {
      this.createCharts(); 
    }
  }

  updateChart(chart: Chart | undefined, data: number[], backgroundColor: string[], borderColor: string[]): void {
    if (chart) {
      chart.data.labels = this.getLabels();
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = backgroundColor;
      chart.data.datasets[0].borderColor = borderColor;
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

  getColorArray(type: 'backgroundColor' | 'borderColor'): string[] {
    const colors = [
      'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'
    ];
    const borderColors = [
      'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'
    ];
    return type === 'backgroundColor' ? colors : borderColors;
  }

  clearLocalStorage(): void {
    localStorage.removeItem('allPaymentsData');
  }
}
