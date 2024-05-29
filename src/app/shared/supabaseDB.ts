import { createClient, SupabaseClient } from '@supabase/supabase-js';


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

class SupabaseService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private static instance: SupabaseService;

  public supabase: SupabaseClient;

  public constructor() {
    this.supabaseUrl = 'https://rayjfxcjyuoolsqecrnt.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheWpmeGNqeXVvb2xzcWVjcm50Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjkxNzA0MSwiZXhwIjoyMDMyNDkzMDQxfQ.YeCD5QZjCCCEXRYPk08YlZ_X0m6wRImJxsUF4Xw62bQ'; // Replace with your Supabase key
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  
  async savePayment(payment_id: string, project_name: string, amount: number, payment_date: Date): Promise<string> {
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
      const { data, error } = await this.supabase
        .from('payments')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching payment information:', error);
      throw error;
    }
  }


  async getDonationData(timeFrame: 'week' | 'month' | 'year'): Promise<DonationData[]> {
    try {
      const payments = await this.getAllPayments();
      const filteredPayments = this.filterPaymentsByTimeFrame(payments, timeFrame);

      const projectData = new Map<string, { totalDonations: number; numberOfDonors: Set<string> }>();

      filteredPayments.forEach(payment => {
        const { project_name, amount } = payment;

        if (!projectData.has(project_name)) {
          projectData.set(project_name, { totalDonations: 0, numberOfDonors: new Set() });
        }

        const project = projectData.get(project_name)!;
        project.totalDonations += amount;
        project.numberOfDonors.add(payment.payment_id); 
      });

      const totalFunds = Array.from(projectData.values()).reduce((acc, project) => acc + project.totalDonations, 0);
      const totalDonors = Array.from(projectData.values()).reduce((acc, project) => acc + project.numberOfDonors.size, 0);

      const donationData: DonationData[] = Array.from(projectData.entries()).map(([project_name, project]) => ({
        project: project_name,
        totalDonations: project.totalDonations,
        numberOfDonors: project.numberOfDonors.size,
        percentageOfTotalFunds: (project.totalDonations / totalFunds) * 100,
        percentageOfDonors: (project.numberOfDonors.size / totalDonors) * 100,
      }));

      return donationData;
    } catch (error) {
      console.error('Error aggregating donation data:', error);
      throw error;
    }
  }

  private filterPaymentsByTimeFrame(payments: Payment[], timeFrame: 'week' | 'month' | 'year'): Payment[] {
    const now = new Date();
    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      if (timeFrame === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return paymentDate >= startOfWeek;
      } else if (timeFrame === 'month') {
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
      } else if (timeFrame === 'year') {
        return paymentDate.getFullYear() === now.getFullYear();
      }
      return false;
    });
  }
}

export default SupabaseService;
