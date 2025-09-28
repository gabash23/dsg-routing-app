# DSG Routing App

A comprehensive shipment management system designed to streamline DSG (Dick's Sporting Goods) routing compliance and optimize logistics workflows. This application ensures all shipments meet DSG routing guidelines through a guided, step-by-step process.

## Overview

The DSG Routing App is a Next.js-based web application that helps warehouse and logistics teams manage shipments according to Dick's Sporting Goods routing requirements. The app provides a complete workflow from shipment setup through final handoff, ensuring compliance at every step.

**Key Innovation**: All compliance requirements and guidelines were extracted from the official Dick's Sporting Goods routing guide using ChatGPT 5 Thinking model, ensuring accuracy and completeness of the implementation. All instructional images were generated using Gemini 2.5.

## Features

### Complete Shipment Workflow

- **Shipment Setup**: PO/DC configuration, TMS ID management, ASN timing & notifications
- **Carton Management**: UCC-128 label generation, conveyability checking, label placement guidelines
- **Pallet Assembly**: Carton selection & assembly, QA checklist compliance, trailer loading guidance
- **Paperwork Management**: BOL completion with TMS ID placement rules and address validation
- **Review & Handoff**: Final compliance check, seal verification, photo documentation

### Mobile-First Design

- Progressive Web App (PWA) capabilities
- Responsive design optimized for mobile devices
- Touch-friendly interface for warehouse environments
- Offline functionality for areas with poor connectivity

### Secure Authentication

- OAuth-based authentication system
- Secure session management
- Role-based access control

### Address Validation

- Google Places API integration for accurate address validation
- Real-time address suggestions and corrections
- Compliance with shipping address requirements

## Technical Architecture

### Frontend

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React hooks and Zustand
- **Authentication**: NextAuth.js with OAuth providers
- **PWA**: Service worker for offline functionality

### Backend

- **API Routes**: Next.js API routes for server-side logic
- **Authentication**: OAuth 2.0 with NextAuth.js
- **Address Validation**: Google Places API integration
- **Data Storage**: Session-based storage with localStorage/sessionStorage

### Key Components

#### Shipment Setup

- PO/DC configuration with validation
- TMS ID format checking (CS prefix requirement)
- ASN notification timing
- Parcel eligibility verification

#### Carton Management

- UCC-128/SSCC-18 label generation
- Conveyability checking based on dimensions and weight
- Visual label placement guidelines with instructional images
- Print specifications for 4×6 thermal labels

#### Pallet Assembly

- Interactive pallet building interface
- QA checklist with compliance tracking
- Trailer loading guidelines with visual aids
- Weight distribution calculations

#### Paperwork Management

- BOL (Bill of Lading) completion wizard
- TMS ID placement rules (GS1 vs non-GS1 BOLs)
- Address validation using Google Places API
- Completeness tracking with progress indicators

#### Review & Handoff

- Multi-stage handoff process
- Seal verification and documentation
- Photo capture for compliance records
- Driver information collection
- Final handoff completion with success confirmation

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Google Places API key (for address validation)
- OAuth provider credentials (Google, GitHub, etc.)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dsg-routing-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_PLACES_API_KEY=your-google-places-api-key
# Add your OAuth provider credentials
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Compliance Features

### DSG Routing Guidelines Implementation

All compliance requirements were extracted from the official Dick's Sporting Goods routing guide using advanced AI analysis, ensuring:

- **Accurate Label Placement**: Visual guides for conveyable vs non-conveyable cartons
- **Proper Documentation**: BOL requirements and TMS ID placement rules
- **Seal Verification**: Complete seal integrity checking process
- **Photo Documentation**: Required documentation photos for compliance
- **Driver Handoff**: Comprehensive handoff process with verification

### Quality Assurance

- Real-time validation at each step
- Progress tracking to ensure completion
- Error prevention through guided workflows
- Compliance verification before handoff

## Deployment

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

This app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions about DSG routing compliance, please refer to the official Dick's Sporting Goods routing guide or contact the development team.
