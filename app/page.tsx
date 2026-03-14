"use client";

import { useState } from "react";
import { Clock, Bell, Activity, TableProperties, Zap } from "lucide-react";

// Helper to parse the LLM generated Markdown table
const parseMarkdownTable = (md: string) => {
  if (!md) return null;
  const lines = md.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
  if (lines.length < 3) return null;
  
  const extractCells = (line: string) => line.split('|').map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
  
  const headers = extractCells(lines[0]);
  const rows = lines.slice(2).map(extractCells).filter(row => row.length === headers.length);
  
  return { headers, rows };
};

export default function Home() {
  const [urlsInput, setUrlsInput] = useState("");
  const [userProductName, setUserProductName] = useState("Durable Leather Bag");
  const [userProductPrice, setUserProductPrice] = useState("1299");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyzeMarket = async () => {
    if (!urlsInput) return;
    setLoading(true);
    setResults(null);
    
    // Process comma-separated URLs
    const urls = urlsInput.split(",").map(u => u.trim()).filter(u => u);

    const user_product_data = {
      name: userProductName,
      price: parseFloat(userProductPrice) || 0,
    };
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, user_product_data }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to connect to the analysis engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Competitive Intelligence Agent
          </h1>
          <p className="text-slate-400 mt-2">Autonomous Market Analysis & Pivot Strategy Engine</p>
        </header>

        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Competitor URLs (Comma Separated)</label>
              <textarea
                placeholder="https://flipkart.com/..., https://meesho.com/..."
                className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-sm"
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Your Product Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={userProductName}
                  onChange={(e) => setUserProductName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Your Price (INR)</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={userProductPrice}
                  onChange={(e) => setUserProductPrice(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={analyzeMarket}
              disabled={loading}
              className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 w-full"
            >
              {loading ? "Initializing Agents & Scraping Market..." : "Run Global Analysis"}
            </button>
          </div>
        </section>

        {results && (
          <div className="mt-8 space-y-8">
            {/* Signals and Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signals */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Detected Market Signals
                </h2>
                <ul className="space-y-3">
                  {results.signals?.map((s: string, i: number) => (
                    <li key={i} className="bg-slate-800/50 p-4 rounded-xl text-slate-200 border border-slate-700 leading-relaxed text-sm">
                      <div className="font-bold text-emerald-300 mb-1">SIGNAL:</div>
                      {s}
                      {results.evidence && results.evidence[i] && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 text-slate-400 italic text-xs">
                          <span className="text-blue-400 font-semibold not-italic">EVIDENCE: </span> 
                          "{results.evidence[i]}"
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Visual Agent Analysis */}
              <div className="bg-slate-900 border border-purple-800/50 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  Visual AI Analysis
                </h2>
                {results.visual_analysis && (
                  <div className="space-y-4 text-sm mt-6">
                    {/* Quality Score Hero */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-purple-500/20 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                      <span className="text-slate-400 mb-2 font-medium">Aggregate Quality Score</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold bg-gradient-to-br from-purple-300 to-purple-500 bg-clip-text text-transparent">
                          {results.visual_analysis.quality_score}
                        </span>
                        <span className="text-xl text-purple-700 font-bold">/100</span>
                      </div>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Primary Material Detected</span>
                      <span className="text-slate-200 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-700/50">
                        {results.visual_analysis.material}
                      </span>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-rose-900/30">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-400 font-medium">Critical Visual Defects</span>
                        <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-xs font-bold border border-rose-500/20">
                          {results.visual_analysis.defects_detected?.length} Found
                        </span>
                      </div>
                      <div className="space-y-3">
                        {results.visual_analysis.defects_detected?.map((d: string, i: number) => (
                          <div key={i} className="flex gap-4 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-800 border border-slate-700 relative group">
                               {/* Mock Image using placekitten/unsplash for demonstration of "finding" an image */}
                              <img 
                                src={results.visual_analysis.analyzed_image_urls?.[i] || `https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=150&h=150&sig=${i}`} 
                                alt="Defect snippet"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 border-2 border-rose-500/50 rounded pointer-events-none"></div>
                            </div>
                            <div>
                               <h4 className="text-slate-200 font-medium mb-1 capitalize">{d.split(' in ')[0]}</h4>
                               <p className="text-slate-500 text-xs text-balance">
                                  Detected via YOLOv8 model in source {d.includes(' in ') ? d.split(' in ')[1] : 'image'}.
                               </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategies */}
              <div className="bg-slate-900 border border-blue-800/50 p-6 rounded-2xl shadow-lg md:col-span-2">
                <h2 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Tactical Pivot Strategies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.strategies?.map((s: string, i: number) => (
                    <div key={i} className="bg-blue-900/20 p-5 rounded-xl text-blue-100 border border-blue-800/50 font-medium leading-relaxed">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmarking Table */}
              {results.benchmark_table && (() => {
                const tableData = parseMarkdownTable(results.benchmark_table);
                if (!tableData) return null;
                
                return (
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg md:col-span-2 overflow-hidden">
                    <h2 className="text-xl font-semibold text-amber-400 mb-6 flex items-center gap-2">
                      <TableProperties className="w-5 h-5 text-amber-400" />
                      Competitive Benchmark Analysis
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                      <table className="w-full text-left font-sans text-sm whitespace-nowrap">
                        <thead className="bg-slate-800/80 text-slate-300">
                          <tr>
                            {tableData.headers.map((h, i) => (
                              <th key={i} className="px-6 py-4 font-semibold tracking-wide border-b border-slate-700">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                          {tableData.rows.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                              {row.map((cell, j) => (
                                <td key={j} className={`px-6 py-4 ${j === 0 ? 'text-slate-300 font-medium' : j === row.length - 1 ? 'text-amber-300 font-medium' : 'text-slate-400'}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Ingestion Logs */}
            <div className="bg-slate-950/50 border border-slate-900 p-6 rounded-2xl">
              <h3 className="text-slate-500 text-sm font-mono uppercase tracking-widest mb-4">Agent Execution Logs</h3>
              <div className="space-y-1 font-mono text-xs text-slate-400">
                {results.logs.map((log: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
