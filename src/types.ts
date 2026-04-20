export interface AccountTier {
  id: string;
  size: number;
  price: number;
  dailyLossLimit: number;
  profitTarget: number;
  overallDrawdown: number;
  payoutShare: number;
  challengeDays?: number;
  instantWithdrawal?: boolean;
}

export interface BrokerInfo {
  name: BrokerType;
  logo: string;
}

export type BrokerType = 'Olymp Trade' | 'Quotex' | 'Binomo' | 'Pocket Option' | 'Other';

export type PaymentMethodType = 'BTC' | 'TRC20' | 'BEP20' | 'ERC20';

export interface CheckoutDetails {
  broker: BrokerType;
  customBrokerName?: string;
  fullName: string;
  address: string;
  country: string;
  email: string;
  paymentMethod: PaymentMethodType;
  proofImage?: string;
}

export interface User {
  email: string;
  fullName: string;
  isAuthenticated: boolean;
}
