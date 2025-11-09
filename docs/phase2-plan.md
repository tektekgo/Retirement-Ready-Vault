# Retirement Ready Vault - Phase 2A Implementation Plan

## Overview
Phase 2A transforms the Retirement Ready Vault from a localStorage-based prototype into a production-ready application with user authentication, cloud data persistence, AI-powered document parsing, and comprehensive usage monitoring.

## Project Context
- **Repository**: https://github.com/tektekgo/Retirement-Ready-Vault
- **Branch**: devin/1762636601-phase2a-supabase-auth
- **Target Domain**: retirement-ready-vault.ai-focus.org
- **Company**: AI-Focus.org (www.ai-focus.org)
- **Contact**: retirement-ready-vault@ai-focus.org

## Phase 1 Completion Status
✅ 5-step wizard with form validation
✅ Three retirement analysis engines (Basic, Intermediate, Advanced Monte Carlo)
✅ Interactive dashboard with Chart.js visualizations
✅ PDF and CSV export functionality
✅ localStorage persistence with hydration fix
✅ Responsive design for mobile and desktop

## Phase 2A Objectives

### 1. User Authentication System
- Supabase Auth with email/password and magic link
- Email verification via Resend API
- Password reset flow
- Protected routes with AuthGuard
- User profile management

### 2. Data Persistence Migration
- Move from localStorage to Supabase PostgreSQL
- Auto-save functionality with debouncing (2 seconds)
- Offline support with sync on reconnect
- Data migration utility for Phase 1 users
- Full CRUD operations for retirement data

### 3. Document Upload & AI Parsing
- PDF and CSV file upload with drag-and-drop
- Supabase Storage for temporary file storage
- AI-powered data extraction using OpenRouter
- Confidence scoring and user review interface
- **Important**: Delete uploaded files after successful data extraction (no long-term storage)
- Support for financial statements and budget exports

### 4. Usage Monitoring & Cost Control
- Real-time API usage tracking (OpenRouter, Resend)
- Cost monitoring with spending limits
- Alert system at 75%, 90%, 100% thresholds
- Admin dashboard for usage statistics
- Key rotation reminders (90-day cycle)

### 5. Production Deployment
- Vercel hosting with custom domain
- SSL certificate configuration
- Environment variable management
- Supabase keepalive GitHub Action (every 4 days)
- Error tracking and monitoring

### 6. UI/UX Redesign
- Material Design inspired layout
- Custom color palette: Deep navy base with teal/coral accents
- Fonts: Inter (body), Poppins (headers)
- AI-Focus branding and logo integration
- Rounded corners, generous whitespace
- Micro-animations and smooth transitions

## Technical Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS with custom theme
- Chart.js for visualizations
- React Hook Form + Zod validation
- React Dropzone for file uploads

### Backend & Services
- Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- Resend API for email notifications
- OpenRouter API for AI document parsing
- Vercel for hosting and serverless functions

### Key Libraries
- @supabase/supabase-js (^2.38.0)
- @supabase/auth-ui-react (^0.4.6)
- react-dropzone (^14.2.3)
- papaparse (^5.4.1)
- react-hook-form (^7.47.0)
- zod (^3.22.4)

## Database Schema

### Tables
1. **user_profiles** - Extended user information
2. **retirement_data** - Single record per user with JSONB fields
3. **uploaded_documents** - Temporary tracking (deleted after extraction)
4. **shared_links** - Password-protected sharing
5. **api_usage_logs** - Cost tracking and monitoring
6. **system_reminders** - Key rotation and alerts

### Storage Buckets
1. **user-documents** (temporary, 10MB limit, PDF/CSV only)
2. **generated-reports** (5MB limit, PDF/CSV only)

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Shared links have time-limited access
- Admin functions use service role

## Implementation Timeline (14 Days)

### Days 1-3: Foundation & Authentication
- [x] Create branch and plan document
- [x] Set up environment variables
- [x] Copy AI-Focus logo to assets
- [ ] Update Tailwind config with custom theme
- [ ] Create SQL schema file
- [ ] Apply schema in Supabase SQL editor
- [ ] Set up Supabase client
- [ ] Implement AuthContext and hooks
- [ ] Create login/registration forms
- [ ] Implement email verification
- [ ] Add password reset flow
- [ ] Create AuthGuard component

### Days 4-6: Data Persistence & Migration
- [ ] Implement RetirementDataService
- [ ] Add auto-save with debouncing
- [ ] Create localStorage migration utility
- [ ] Update wizard to use Supabase
- [ ] Add offline support
- [ ] Test data sync across sessions

### Days 7-10: Document Upload & AI Parsing
- [ ] Create document upload UI
- [ ] Implement Supabase Storage integration
- [ ] Create Edge Function for PDF parsing
- [ ] Integrate OpenRouter for AI extraction
- [ ] Build parsed data review interface
- [ ] Add confidence scoring
- [ ] Implement auto-delete after extraction

### Days 11-12: Usage Monitoring
- [ ] Create API usage tracking wrapper
- [ ] Implement cost monitoring
- [ ] Add spending limit enforcement
- [ ] Build admin dashboard
- [ ] Create email alerts
- [ ] Add key rotation reminders

### Days 13-14: Deployment & Polish
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Create Supabase keepalive GitHub Action
- [ ] Apply final UI polish
- [ ] Run comprehensive testing
- [ ] Create user documentation

## Security Measures

### Authentication
- Password policy: 8+ chars, uppercase, lowercase, numbers, symbols
- Email verification required
- Session timeout: 24 hours
- Refresh tokens: automatic

### Data Protection
- TLS 1.3 for data in transit
- Supabase built-in encryption at rest
- RLS policies for all tables
- Client-side validation with Zod
- Server-side validation with RLS

### File Upload Security
- File type validation (PDF, CSV only)
- Max file size: 10MB
- User-specific storage folders
- Temporary storage (deleted after extraction)
- Rate limiting: 5 files per hour per user

### API Security
- Environment variables for all keys
- Never expose keys in client code
- Rate limiting on all endpoints
- Usage monitoring and alerts
- Quarterly key rotation reminders

## Cost Optimization Strategy

### Free Tier Targets
- Supabase: Free tier (500MB database, 1GB storage)
- Vercel: Free tier (100GB bandwidth)
- Resend: Free tier (100 emails/day)
- OpenRouter: Cost-effective models (GPT-3.5 equivalent)

### Storage Optimization
- **Critical**: Delete uploaded documents after data extraction
- No long-term file storage
- Only store extracted data in database
- Generated reports: 90-day retention
- Compress PDF exports

### API Usage Optimization
- Batch operations where possible
- Cache frequently accessed data
- Debounce auto-save (2 seconds)
- Use cost-effective AI models
- Monitor and alert on spending

### Supabase Keepalive
- GitHub Action runs every 4 days
- Prevents project deactivation
- Email notifications on success/failure
- Minimal database queries

## Environment Variables

```env
VITE_SUPABASE_URL=https://cqwuursyoonmbczzqtnl.supabase.co
VITE_SUPABASE_ANON_KEY=[provided]
VITE_SUPABASE_SERVICE_ROLE_SECRET=[provided - server-side only]
VITE_RESEND_API_KEY=[provided]
VITE_OPENROUTER_API_KEY=[provided]
VITE_APP_URL=https://retirement-ready-vault.ai-focus.org
VITE_OPENROUTER_SPENDING_LIMIT=5
VITE_ADMIN_EMAIL=retirement-ready-vault@ai-focus.org
```

## Key Decisions

### 1. PDF Parsing Approach
**Decision**: Use Supabase Edge Functions with pdf-parse
**Rationale**: 
- Keeps API keys server-side
- Enables usage tracking
- Prevents client-side exposure
- Consistent with Supabase architecture

### 2. Document Storage Policy
**Decision**: Delete files immediately after successful data extraction
**Rationale**:
- Minimizes storage costs
- Reduces security risk
- Stays within free tier
- Only extracted data is needed

### 3. Authentication Flow
**Decision**: Email/password + magic link
**Rationale**:
- Flexibility for users
- Better UX with magic link
- Email verification ensures valid addresses
- Standard for financial applications

### 4. UI Design Approach
**Decision**: Material Design inspired with custom branding
**Rationale**:
- Professional and familiar
- Generous whitespace improves readability
- Custom colors maintain brand identity
- Rounded corners soften financial data presentation

## Success Criteria

### Must-Have Features (MVP)
✅ Complete authentication flow (registration → verification → login)
✅ Data persistence with auto-save
✅ localStorage to Supabase migration
✅ Document upload with AI parsing
✅ Automatic file deletion after extraction
✅ Usage monitoring and cost alerts
✅ Production deployment with custom domain
✅ Supabase keepalive automation
✅ Email notifications working

### Quality Metrics
- All TypeScript compilation successful
- ESLint checks passing
- Responsive design on mobile and desktop
- Page load time < 3 seconds
- Auto-save latency < 2 seconds
- AI parsing accuracy > 70% confidence

## Risk Mitigation

### Technical Risks
1. **Risk**: Supabase free tier limits exceeded
   **Mitigation**: Aggressive storage cleanup, usage monitoring, alerts

2. **Risk**: AI parsing accuracy too low
   **Mitigation**: Confidence scoring, manual review interface, user corrections

3. **Risk**: Migration data loss
   **Mitigation**: Keep localStorage as backup until confirmed success

4. **Risk**: Supabase project deactivation
   **Mitigation**: GitHub Action keepalive every 4 days with email alerts

### Security Risks
1. **Risk**: API key exposure
   **Mitigation**: Server-side functions only, never in client code

2. **Risk**: Unauthorized data access
   **Mitigation**: Comprehensive RLS policies, tested with multiple users

3. **Risk**: File upload vulnerabilities
   **Mitigation**: Strict validation, type checking, size limits

## Post-Implementation

### Monitoring
- Daily usage reports
- Weekly cost summaries
- Monthly performance reviews
- Quarterly key rotation

### Maintenance
- Database backups (Supabase automatic)
- Error log reviews
- User feedback collection
- Performance optimization

### Future Enhancements (Phase 2B)
- AI-powered retirement advice chat
- Social Security optimization calculator
- Tax-advantaged withdrawal strategies
- Collaborative planning with advisors
- Mobile app (React Native)

## Notes
- This document serves as the handoff artifact for future sessions
- All decisions are documented for context
- Timeline is aggressive but achievable
- Focus on core functionality over advanced features
- Maintain Phase 1 accuracy in all calculations
