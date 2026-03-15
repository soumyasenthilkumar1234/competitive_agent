# 🚀 Competitive Intelligence Agent (PS-D3)

An autonomous agentic system designed to transform raw e-commerce data into high-impact competitive strategies.

---

## 🚩 Problem Statement
In the fast-paced Indian e-commerce market (Amazon, Flipkart, etc.), sellers struggle to keep up with competitors. Manual analysis of pricing trends, customer sentiment, and inventory volume is **slow, fragmented, and error-prone**. Sellers often find themselves reactive rather than proactive, losing market share due to delayed pricing adjustments or missed product quality signals.

## 🎯 Objective
The objective of this project is to build a **Multi-Agent Intelligence Layer** that:
1.  **Discoveries**: Automatically identifies relevant competitors based on a single product URL.
2.  **Analyzes**: Benchmarks the seller's product against the market across Price, Sentiment, and Scale.
3.  **Strategizes**: Generates actionable, full-sentence strategic suggestions to help sellers "pivot" their market position effectively.

---

## 🤖 Agents Used
This system leverages a sophisticated **Agentic Workflow** built with LangGraph:

1.  **Ingestion Agent**: 
    *   Scrapes product details (Name, Price, Category) from provided URLs.
    *   Uses DuckDuckGo Search to autonomously find top competitors across marketplaces.
2.  **Correlation Agent**:
    *   Cross-references data points to identify "Market Signals."
    *   Finds gaps between price and quality (e.g., "Priced 20% higher despite having fewer reviews").
3.  **Strategy Agent**:
    *   The decision-making hub. It synthesizes analysis into a **Comparative Matrix**.
    *   Generates full-sentence **Opportunity Suggestions** (e.g., *"Leverage your superior 4.2 rating as a key trust signal vs competitors"*).

---

## 💻 Tech Stack
*   **Frontend**: `Next.js 14`, `React`, `Tailwind CSS`, `Lucide Icons` (Premium Dark UI).
*   **Backend**: `Python 3.10+`, `LangGraph` (Agent Orchestration), `LangChain`.
*   **Discovery**: `DuckDuckGo Search API`, `BeautifulSoup4`.
*   **LLM Power**: `Groq` (Llama 3) for high-speed reasoning or `Google Gemini`.
*   **Source Control**: `Git` / `GitHub`.

---

## 💡 Solution
Our solution provides a **Unified Competitive Dashboard**. 
Instead of looking at spreadsheets, a seller simply enters their product URL. The agents take over, crawling the web and returning a **Comparative Matrix** that doesn't just show numbers, but explains **why they matter**. Our unique "Opportunity" engine provides human-readable strategic advice, allowing sellers to make data-backed decisions in seconds rather than hours.

---

## 🏁 Conclusion
The Competitive Intelligence Agent successfully demonstrates how **Autonomous Agentic Layers** can bridge the gap between Big Data and Business Strategy. By automating the discovery and benchmarking phases, we empower small and medium sellers to compete with giant brands by making their marketing and pricing moves smarter, faster, and more precise.

---

## 🛠️ Startup Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- API Keys: 
    - [Firecrawl API Key](https://www.firecrawl.dev/) (Optional)
    - [Groq AI](https://console.groq.com/) OR [Google Gemini](https://aistudio.google.com/)

### 2. Backend Setup
1. `cd backend`
2. Configure `.env` with your API keys.
3. Run terminal test: `..\venv\Scripts\python main.py`

### 3. Frontend Setup
1. Root directory: `npm install`
2. Start server: `npm run dev` (Runs on [http://localhost:3000](http://localhost:3000))