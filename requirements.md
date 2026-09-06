# FinTwin — AI Financial Digital Twin: Comprehensive Requirements Specification

> **Document Version:** 1.0.0  
> **Reference Specs:** `FinTwin Hackathon Documentation` & `FINTWIN-UXDS-V1.0 UI/UX Design Specification`  
> **Tagline:** *"Don't just track where your money went. See where your money is going."*  
> **Project Type:** FinTech + Artificial Intelligence + Machine Learning + Interactive IoT Simulation

---

## 1. Executive Summary & Product Vision

### 1.1 Product Overview
**FinTwin** is an AI-powered personal finance platform that creates a real-time digital representation ("digital twin") of an individual's financial behavior. Unlike traditional expense trackers that look exclusively at historical transactions, FinTwin focuses on **predictive intelligence, early warning interventions, and proactive decision support**.

### 1.2 Core Problem Statement
- Traditional finance apps inform users after they have already overspent.
- Major purchases (e.g., buying a ₹70,000 phone with cash) are often evaluated in isolation without understanding the cascading impact on emergency funds, monthly cash flows, EMI burdens, and long-term goal completion.
- Disconnected financial dependencies (loans, EMIs, subscriptions, utility bills, credit cards) lead to blind spots before payday.

### 1.3 Core Value Proposition
- **Predictive Decision Support:** *"What will happen to my finances if I buy this, save this amount, or change this spending habit?"*
- **Active Guardian & OCR Scanner:** Intercepts receipts and bills before money is permanently committed, warning the user in real-time if a category budget is approaching or breached.
- **Side-by-Side What-If Simulation:** Evaluates immediate cash purchases vs. 3/6/12-month EMIs vs. structured saving plans.
- **Explainable AI Advisor:** Translates deterministic mathematical financial formulas into actionable natural-language advice.
- **Physical Financial Health Meter:** Visualized IoT (ESP32 + OLED + RGB LED) reflecting live risk status.

---

## 2. Target Personas

| Persona | Demographics & Profile | Primary Goals & Pain Points | FinTwin Solution |
| :--- | :--- | :--- | :--- |
| **Persona A: The Budget-Conscious Professional** | Age 24–35, salaried. Uses 3–5 recurring subscriptions and 1–2 EMIs. | Wants to avoid overspending before paycheck; hates complex spreadsheets. | Real-time budget progress bars, instant bill scan budget warnings, upcoming dues alerts. |
| **Persona B: The Freelancer with Irregular Income** | Age 25–40, variable monthly income. Mixes client invoices and personal expenses. | Needs to clearly separate fixed obligations from discretionary spending. | Financial Dependencies Grid, dynamic cashflow projections, emergency fund coverage tracker. |
| **Persona C: The Family Budget Manager** | Age 30–50, manages household utilities, school fees, home loan EMIs, insurance. | Low-friction bill logging without manual data entry. | Smart OCR bill scanner, automated category matching, multi-goal planner. |

---

## 3. Detailed Functional Requirements

### 3.1 Financial Profile & Digital Twin Engine
- **FR-1.1:** Maintain structured state of monthly income, liquid savings, categorized expenses, active debts, and financial goals.
- **FR-1.2:** Calculate **Emergency Fund Coverage**:
  $$\text{Emergency Fund (Months)} = \frac{\text{Current Savings}}{\text{Essential Monthly Expenses}}$$
- **FR-1.3:** Calculate **Financial Health Score (0–100)**:
  - **Savings Behavior (30% weight):** Ratio of monthly savings to net income.
  - **Expense Control (20% weight):** Adherence to defined category budgets.
  - **Emergency Fund (20% weight):** Score based on months of coverage (3–6 months target).
  - **Debt Burden (15% weight):** Debt-to-Income (DTI) ratio.
  - **Goal Progress (15% weight):** On-track pacing across active targets.
- **FR-1.4:** Map Health Scores to standardized tiers:
  - `80–100`: **Excellent** (Mint Green)
  - `60–79`: **Good** (Indigo / Blue)
  - `40–59`: **Moderate** (Amber)
  - `20–39`: **Risky** (Orange)
  - `0–19`: **Critical** (Coral Red)

### 3.2 Smart Bill Scanner & Real-Time OCR Flow
- **FR-2.1:** Provide drag-and-drop receipt upload, live camera capture, and preset sample bills (Supermarket ₹3,450, Electronics ₹69,999, Cafe ₹1,850, Electricity ₹2,400).
- **FR-2.2:** Multi-state OCR animation with laser line scan and step-by-step progress reassurance.
- **FR-2.3:** Editable extraction review (Merchant, Date, Category, Amount, Payment Method) with zoomable receipt preview.
- **FR-2.4:** **Real-Time Budget Impact Check** displaying remaining category capacity before logging:
  - *Within Budget (0–79%):* Mint green badge (`"Logged. You have ₹X left in Groceries this month."`).
  - *Approaching Limit (80–99%):* Amber warning (`"Warning: You are close to your Groceries limit. ₹Y remaining."`).
  - *Over Budget (≥100%):* Coral Red modal with shake animation (`"Critical Alert: This bill is ₹Z above your budget."`).
  - *Overall Budget Breach:* High-visibility dismissible banner on Dashboard.

### 3.3 What-If Simulation Engine
- **FR-3.1:** Input parameters: Purchase item name, amount, payment method (Cash vs Credit vs EMI vs Delayed Savings), EMI duration (3, 6, 9, 12 months), interest rate %, and target goal impact.
- **FR-3.2:** Execute deterministic calculations to project:
  - New liquid savings balance.
  - Updated emergency fund coverage (months).
  - Projected Financial Health Score change ($\Delta$ score).
  - Risk Classification: **Low Risk**, **Moderate Risk**, **High Risk**, or **Critical Danger**.
- **FR-3.3:** **Side-by-Side Multi-Scenario Matrix**:
  - *Option 1: Buy Now (Cash)* — Immediate liquidity hit, emergency fund impact.
  - *Option 2: Low-Cost EMI* — Preserves cash reserves, adds monthly recurring obligation.
  - *Option 3: Save & Delay* — Zero debt, reaches purchase in $N$ months safely.
- **FR-3.4:** Actionable outcome: "Apply Scenario", "Save as Goal", or "Consult AI Advisor".

### 3.4 Machine Learning & Trend Forecasting Engine
- **FR-4.1:** Category-level and total spending predictions using regression modeling.
- **FR-4.2:** 1-month, 3-month, 6-month, and 12-month savings trajectory forecast.
- **FR-4.3:** Anomaly detection flagging categories trending >15% higher than baseline.
- **FR-4.4:** Interactive scenario modifiers (e.g., "+10% salary increment", "-20% dining out").

### 3.5 Goal Planner & Milestone Tracker
- **FR-5.1:** Create financial goals with target amount, deadline, category, and monthly contribution.
- **FR-5.2:** Dynamic milestone completion dates and feasibility risk indicator.
- **FR-5.3:** "What-if" goal accelerator (e.g., *"What happens if I save ₹2,000 more every month?"*).

### 3.6 Financial Dependencies & Recurring Obligations
- **FR-6.1:** Categorized tracker for **Loans**, **EMIs**, **Subscriptions**, **Credit Cards**, and **Insurance**.
- **FR-6.2:** Payoff progress bars, remaining tenures, interest rates, and upcoming due date countdown badges.
- **FR-6.3:** DTI (Debt-to-Income) impact calculation.

### 3.7 AI Financial Advisor (Conversational Assistant)
- **FR-7.1:** Context-aware chatbot utilizing pre-calculated deterministic financial state.
- **FR-7.2:** One-click quick query chips:
  - *"Can I afford a ₹70,000 phone?"*
  - *"Where am I overspending?"*
  - *"How much can I save in one year?"*
  - *"When can I reach my bike goal?"*
  - *"Why did my financial health score decrease?"*
- **FR-7.3:** Structured AI response cards featuring risk badges, math breakdowns, and alternative action steps.
- **FR-7.4:** Optional Gemini API key connection with robust offline deterministic fallbacks.

### 3.8 Virtual ESP32 Hardware Health Meter Simulator
- **FR-8.1:** Interactive visual 128x64 OLED display component rendering pixel graphics, health score, emergency coverage, and current status.
- **FR-8.2:** Glowing RGB LED reflecting real-time risk level (Green, Amber, Red).
- **FR-8.3:** Interactive physical push-button to cycle OLED display screens.
- **FR-8.4:** Embedded, downloadable Arduino C++ source code (`fintwin_esp32.ino`) for live hardware demonstration.

### 3.9 Onboarding & Persona Switcher (Demo Flow)
- **FR-9.1:** 4-step interactive onboarding wizard for new profiles.
- **FR-9.2:** Instant persona switcher (Persona A, Persona B, Persona C, and Reset Demo Data).
- **FR-9.3:** Preset "Winning Hackathon Demo Flow" (Income ₹50k, Expenses ₹27k, Savings ₹80k $\rightarrow$ ₹70k Phone simulation).

---

## 4. UI/UX Design System Specification

### 4.1 Color System & Tokens
| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Primary Accent (Indigo)** | `#4F46E5` | Primary buttons, active nav, primary chart lines |
| **Primary Dark** | `#3730A3` | Hover states, active header accents |
| **Success State (Mint Green)** | `#22C55E` | Within-budget confirmations, positive cash flow |
| **Warning State (Amber)** | `#F59E0B` | Approaching budget limit (80%–99%), moderate risk |
| **Danger State (Coral Red)** | `#EF4444` | Over-budget alerts, critical breaches, high risk |
| **Neutral Dark (Ink)** | `#0F172A` | Primary typography, dark headers |
| **Neutral Light (Slate)** | `#64748B` | Secondary captions, borders, inactive tabs |
| **Background Fill (Cloud)** | `#F8FAFC` | Light mode canvas and card backgrounds |
| **Dark Canvas** | `#0B1220` | Dark mode main background |
| **Dark Surface** | `#131C2E` | Dark mode card containers and sidebars |

### 4.2 Typography & Spacing
- **Headings:** Satoshi / General Sans (Bold, 20px–48px)
- **Body & Tabular Data:** Inter (Regular/Medium, 12px–16px) with tabular figures for currency alignment.
- **Grid:** 8px base spacing, 12-column responsive layout, 16px/24px card border radius, soft glassmorphic drop shadow (`0 4px 16px rgba(15,23,42,0.06)`).

---

## 5. Non-Functional Requirements
- **NFR-1 (Performance):** Sub-50ms deterministic calculation and simulation response times.
- **NFR-2 (Accessibility):** WCAG 2.1 AA contrast ratios (minimum 4.5:1), keyboard navigation, screen reader aria-labels.
- **NFR-3 (Data Persistence):** LocalStorage persistence for user edits, custom bills, goals, and scenarios.
- **NFR-4 (Responsiveness):** Fluid layout across mobile (bottom tab bar, persistent FAB), tablet, and desktop (sidebar layout).
- **NFR-5 (Privacy & Security):** Client-side synthetic data simulation; no banking credentials or sensitive PII required.
