# Retirement Ready Vault

A secure retirement planning application that helps individuals organize and maintain retirement information for easy sharing with consultants or planners.

## Features

### Phase 1 (Current)
- **Multi-step Wizard**: Collect comprehensive retirement data through 5 intuitive steps
  - Personal Information
  - Monthly Expenses (Essential & Discretionary)
  - Current Assets
  - Income Sources
  - Risk Assessment

- **Analysis Engine**: Three calculation methods
  - Basic: 70-80% income replacement rule
  - Intermediate: 4% withdrawal rule with inflation
  - Advanced: Monte Carlo simulation (1000 iterations)

- **Interactive Dashboard**: 
  - Retirement readiness score
  - Visual charts (Portfolio projection, Expense breakdown, Asset allocation)
  - Key metrics and recommendations
  - Export to PDF and CSV

- **Data Persistence**: LocalStorage for wizard progress

## Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Export**: jsPDF, Papa Parse
- **Backend**: Firebase (Firestore, Auth) - Ready for integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tektekgo/Retirement-Ready-Vault.git
cd Retirement-Ready-Vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your Firebase configuration (optional for Phase 1).

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── wizard/           # Multi-step wizard components
│   ├── dashboard/        # Dashboard and charts
│   ├── shared/           # Shared components
│   └── ai-chat/          # AI chat (Phase 2)
├── hooks/                # Custom React hooks
├── services/             # Business logic and API services
│   ├── firebase.ts       # Firebase configuration
│   ├── retirementCalculations.ts  # Analysis engines
│   └── export.ts         # PDF/CSV export
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Usage

1. **Complete the Wizard**: Fill out all 5 steps with your retirement information
2. **View Analysis**: Review your retirement readiness score and projections
3. **Switch Analysis Methods**: Compare Basic, Intermediate, and Advanced calculations
4. **Export Reports**: Download PDF or CSV reports for your records or to share with advisors

## Roadmap

### Phase 2 (Future)
- AI-powered chat with OpenRouter integration
- Firebase authentication and cloud storage
- Secure sharing with password-protected links
- Advanced scenario modeling
- Email integration with Resend API

## Security

- All sensitive data is stored locally in Phase 1
- Firebase security rules will be implemented in Phase 2
- No financial data is transmitted without explicit user action

## License

See LICENSE file for details.

## Contributing

This is a private project. For questions or contributions, please contact the repository owner.
