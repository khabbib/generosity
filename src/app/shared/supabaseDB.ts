import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

interface Payment {
  payment_id: string;
  project_name: string;
  amount: number;
  payment_date: string;
}

interface DonationData {
  project: string;
  totalDonations: number;
  numberOfDonors: number;
  percentageOfTotalFunds: number;
  percentageOfDonors: number;
}

@Injectable({
  providedIn: 'root',
})
class SupabaseService {
  public supabase: SupabaseClient;

  public constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  async savePayment(
    payment_id: string,
    project_name: string,
    amount: number,
    payment_date: Date
  ): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .insert([{ payment_id, project_name, amount, payment_date }]);

      if (error) throw error;
      return 'success';
    } catch (error) {
      console.error('Error saving payment information:', error);
      return 'fail';
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      const { data, error } = await this.supabase.from('payments').select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment information:', error);
      throw error;
    }
  }

  filterPaymentsByTimeFrame(
    payments: Payment[],
    timeFrame: 'week' | 'month' | 'year'
  ): DonationData[] {
    const now = new Date();
    const filteredPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.payment_date);
      if (timeFrame === 'week') {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);
        return paymentDate >= oneWeekAgo && paymentDate <= now;
      } else if (timeFrame === 'month') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return paymentDate >= thirtyDaysAgo && paymentDate <= now;
      } else if (timeFrame === 'year') {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        return paymentDate >= oneYearAgo && paymentDate <= now;
      }
      return false;
    });

    const projectGroups = filteredPayments.reduce(
      (acc, payment) => {
        const projectName = payment.project_name;
        if (!acc[projectName]) {
          acc[projectName] = {
            project: projectName,
            totalDonations: 0,
            numberOfDonors: 0,
            percentageOfTotalFunds: 0,
            percentageOfDonors: 0,
          };
        }
        acc[projectName].totalDonations += payment.amount;
        acc[projectName].numberOfDonors += 1;
        return acc;
      },
      {} as { [key: string]: DonationData }
    );

    const donationData = Object.values(projectGroups);
    const totalFunds = donationData.reduce(
      (acc, project) => acc + project.totalDonations,
      0
    );
    const totalDonors = donationData.reduce(
      (acc, project) => acc + project.numberOfDonors,
      0
    );

    donationData.forEach((project) => {
      project.percentageOfTotalFunds = totalFunds
        ? (project.totalDonations / totalFunds) * 100
        : 0;
      project.percentageOfDonors = totalDonors
        ? (project.numberOfDonors / totalDonors) * 100
        : 0;
    });

    return donationData;
  }
}

export default SupabaseService;
