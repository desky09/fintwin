# FinTwin 💰🤖

### Your finances. Simulated before you decide.

> **"Don't just track where your money went. See where your money is going."**

FinTwin is an **AI-powered personal finance platform** that creates a real-time **digital twin of an individual's financial behavior**.

Unlike traditional expense trackers that only tell you what happened, FinTwin focuses on **predicting what could happen next** — helping users understand the financial impact of purchases, EMIs, spending habits, savings decisions, and long-term goals.

---

## 🚀 What Makes FinTwin Different?

FinTwin turns financial management from **reactive tracking → proactive decision-making**.

Instead of asking:

> *"Where did my money go?"*

FinTwin helps answer:

> *"What will happen to my finances if I spend ₹70,000 today?"*

The platform combines deterministic financial calculations, machine-learning forecasting, OCR, conversational AI, and an interactive ESP32-inspired financial health meter.

---

## ✨ Key Features

### 🧠 Financial Digital Twin

Maintains a structured representation of:

* Monthly income
* Liquid savings
* Categorized expenses
* Active debts
* EMIs and recurring obligations
* Financial goals

### 📊 Financial Health Score

A **0–100 financial health score** based on:

| Factor           | Weight |
| ---------------- | -----: |
| Savings Behavior |    30% |
| Expense Control  |    20% |
| Emergency Fund   |    20% |
| Debt Burden      |    15% |
| Goal Progress    |    15% |

The score is mapped into five financial health tiers:

`Excellent` → `Good` → `Moderate` → `Risky` → `Critical`

---

### 📸 Smart Bill & Receipt Scanner

Upload or capture a bill and FinTwin extracts:

* Merchant
* Date
* Category
* Amount
* Payment Method

Before the transaction is logged, FinTwin checks its impact on the user's category budget and provides an immediate warning when spending approaches or exceeds the limit.

---

### 🔮 What-If Financial Simulator

One of FinTwin's core features.

Users can simulate decisions such as:

> **"Can I afford this ₹70,000 phone?"**

The simulator compares:

**Buy Now**

* Immediate savings impact
* Emergency fund impact

**EMI**

* Preserves liquidity
* Adds monthly obligations
* Accounts for interest

**Save & Delay**

* Avoids debt
* Calculates the time required to reach the purchase amount

Users can compare scenarios side-by-side before making a financial decision.

---

### 📈 ML Spending & Savings Forecast

FinTwin provides predictive insights including:

* Category-level spending prediction
* Total spending forecasts
* 1 / 3 / 6 / 12-month savings trajectories
* Spending anomaly detection
* Interactive financial scenario modifiers

The system can flag categories trending significantly above their normal baseline.

---

### 🎯 Goal Planner

Create financial goals with:

* Target amount
* Deadline
* Category
* Monthly contribution
* Milestones

Users can also test:

> **"What happens if I save ₹2,000 more every month?"**

and see how their goal completion timeline changes.

---

### 💳 Financial Dependency Tracker

Track recurring financial obligations such as:

* Loans
* EMIs
* Subscriptions
* Credit Cards
* Insurance

The system provides payoff progress, remaining tenure, interest information, upcoming dues, and Debt-to-Income impact.

---

### 🤖 AI Financial Advisor

FinTwin includes a context-aware conversational assistant that can answer questions such as:

* Can I afford a ₹70,000 phone?
* Where am I overspending?
* How much can I save in one year?
* When can I reach my bike goal?
* Why did my financial health score decrease?

The AI layer works with the platform's pre-calculated financial state and can optionally connect to the **Gemini API**, while retaining deterministic fallbacks.

---

### 🔌 ESP32 Financial Health Meter

FinTwin also bridges software with hardware.

The virtual hardware interface represents financial health through:

* **128×64 OLED display**
* Financial health score
* Emergency fund coverage
* Current financial status
* RGB risk indicator
* Interactive push button

An Arduino C++ implementation is also designed for physical ESP32 demonstrations.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      USER INPUT     │
                    │ Income / Expenses   │
                    │ Bills / Goals       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   DIGITAL TWIN      │
                    │ Financial State     │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             ▼                 ▼                 ▼
      ┌────────────┐    ┌────────────┐    ┌────────────┐
      │ OCR / Bills│    │ Simulation │    │ ML Forecast│
      └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ FINANCIAL ANALYSIS  │
                    │ Health Score / Risk │
                    │ Cashflow / Goals    │
                    └──────────┬──────────┘
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
          ┌───────────────┐        ┌────────────────┐
          │ AI ADVISOR    │        │ ESP32 METER    │
          │ Recommendations│        │ OLED + RGB LED │
          └───────────────┘        └────────────────┘
```

---

## 🎯 Demo Scenario

FinTwin includes a hackathon-focused demonstration flow:

```text
Monthly Income     → ₹50,000
Monthly Expenses   → ₹27,000
Current Savings    → ₹80,000
                     ↓
              ₹70,000 Phone
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
      CASH          EMI      SAVE & DELAY
        ↓            ↓            ↓
  Liquidity Hit   New EMI     Zero Debt
        ↓            ↓            ↓
        └────────────┼────────────┘
                     ↓
            Financial Analysis
                     ↓
              AI Recommendation
```

---

## 🔢 Core Financial Logic

### Emergency Fund Coverage

```text
Emergency Fund (Months)
        =
Current Savings / Essential Monthly Expenses
```

### Financial Health Score

```text
Health Score =
    Savings Behavior      × 30%
  + Expense Control       × 20%
  + Emergency Fund       × 20%
  + Debt Burden           × 15%
  + Goal Progress         × 15%
```

---

## 🎨 UI/UX

FinTwin follows a modern financial dashboard design with:

* Responsive desktop, tablet and mobile layouts
* Light & dark interfaces
* Glassmorphic cards
* Financial risk indicators
* Interactive charts
* Accessible keyboard navigation
* WCAG 2.1 AA-oriented contrast
* 8px spacing system
* Responsive 12-column grid

### Risk States

| Status       | Meaning |
| ------------ | ------- |
| 🟢 Excellent | 80–100  |
| 🔵 Good      | 60–79   |
| 🟡 Moderate  | 40–59   |
| 🟠 Risky     | 20–39   |
| 🔴 Critical  | 0–19    |

---

## 🔐 Privacy First

FinTwin is designed around **client-side synthetic financial data**.

* No banking credentials required
* No sensitive banking information required
* Local data persistence
* Synthetic demo profiles
* Designed for privacy-conscious financial simulation

---

## 📱 Target Users

FinTwin is designed for different financial lifestyles:

**Budget-Conscious Professionals**
Want simple tools to avoid overspending and manage recurring expenses.

**Freelancers**
Need flexible cash-flow projections for irregular income.

**Family Budget Managers**
Need low-friction bill management, household planning, and multiple financial goals.

---

## 💡 Product Philosophy

Traditional finance applications:

```text
Transaction
     ↓
Record
     ↓
Dashboard
     ↓
"Here's what happened."
```

FinTwin:

```text
Financial State
      ↓
Possible Decision
      ↓
Simulation
      ↓
Risk Analysis
      ↓
AI Explanation
      ↓
"Here's what could happen."
```

---

## 🛠️ Project Highlights

* 🤖 Artificial Intelligence
* 📊 Machine Learning
* 💰 FinTech
* 🔮 Predictive Analytics
* 📸 OCR
* 🧮 Deterministic Financial Modeling
* 🎯 Goal Optimization
* 💬 Conversational AI
* 🔌 ESP32 / IoT Simulation
* 📱 Responsive UI/UX
* 🔐 Privacy-focused synthetic data

---

## 🌟 Vision

FinTwin aims to make personal finance **predictive, understandable, and actionable**.

The goal isn't simply to show users their financial history.

It's to give them a way to **simulate decisions before making them**.

> **See the consequence before you make the commitment.**

---

## 📄 Project Specification

This README is based on the FinTwin Requirements Specification and UX Design Specification, Version 1.0.0.
