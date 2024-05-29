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
    await this.loadChartData();
    this.createCharts();
  }

  async loadChartData(): Promise<void> {
    const localData = localStorage.getItem(`donationsData_${this.currentFrame}`);
    if (localData) {
      this.donationsData = JSON.parse(localData);
    } else {
      try {
        this.donationsData = await this.supabaseService.getDonationData(this.currentFrame);
        localStorage.setItem(`donationsData_${this.currentFrame}`, JSON.stringify(this.donationsData));
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    }
    console.log("Loaded donationsData: ", this.donationsData); 
    this.updateCharts();
  }

  setTimeFrame(frame: 'week' | 'month' | 'year'): void {
    this.currentFrame = frame;
    this.loadChartData(); 
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
    console.log("Updating charts with data: ", this.donationsData);
    this.updateChart(this.barChart1, this.getTotalDonations(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    this.updateChart(this.barChart2, this.getNumberOfDonors(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    this.updateChart(this.pieChart1, this.getPercentageOfTotalFunds(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
    this.updateChart(this.pieChart2, this.getPercentageOfDonors(), this.getColorArray('backgroundColor'), this.getColorArray('borderColor'));
  }

  updateChart(chart: Chart | undefined, data: number[], backgroundColor: string[], borderColor: string[]): void {
    if (chart) {
      console.log("Updating chart with data: ", data); 
      chart.data.labels = this.getLabels();
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = backgroundColor;
      chart.data.datasets[0].borderColor = borderColor;
      chart.update();
    }
  }

  getLabels(): string[] {
    console.log("Lable: " , this.donationsData.map(data => data.project))
    return this.donationsData.map(data => data.project);
  }

  getTotalDonations(): number[] {
    const totalDonations = this.donationsData.map(data => data.totalDonations);
    console.log("Total Donations Data: ", totalDonations); 
    return totalDonations;
  }

  getNumberOfDonors(): number[] {
    const numberOfDonors = this.donationsData.map(data => data.numberOfDonors);
    console.log("Number of Donors Data: ", numberOfDonors);
    return numberOfDonors;
  }

  getPercentageOfTotalFunds(): number[] {
    const percentageOfTotalFunds = this.donationsData.map(data => data.percentageOfTotalFunds);
    console.log("Percentage of Total Funds Data: ", percentageOfTotalFunds); 
    return percentageOfTotalFunds;
  }

  getPercentageOfDonors(): number[] {
    const percentageOfDonors = this.donationsData.map(data => data.percentageOfDonors);
    console.log("Percentage of Donors Data: ", percentageOfDonors); 
    return percentageOfDonors;
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
}
