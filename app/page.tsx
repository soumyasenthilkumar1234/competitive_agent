"use client";

import { useState } from "react";
import { Clock, Bell, Activity, TableProperties, Zap, ExternalLink } from "lucide-react";

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
  const [sellerUrl, setSellerUrl] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Amazon", "Flipkart"]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false); 
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCompetitors, setSelectedCompetitors] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState<"discovery" | "analysis" | null>(null);

  const platforms = [
    "Amazon", "Flipkart", "Meesho", "Myntra", 
    "eBay", "Walmart", "Target", "Alibaba", 
    "AliExpress", "Reliance Digital", "Tata CLiQ"
  ];

  const searchCompetitors = async () => {
    if (!sellerUrl) return;
    setSearching(true);
    setSearchResults([]);
    setResults(null);
    setCurrentPhase("discovery");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          search_only: true,
          competitor_name: competitorName, 
          platforms: selectedPlatforms,
          seller_url: sellerUrl
        }),
      });
      const data = await response.json();
      if (data.error) {
        alert("Search Error: " + data.error);
      } else if (data.discoveries) {
        setSearchResults(data.discoveries);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const analyzeMarket = async () => {
    if (selectedCompetitors.length === 0) {
      alert("Please select at least one competitor to analyze.");
      return;
    }
    setLoading(true);
    setResults(null);
    setCurrentPhase("analysis");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          seller_url: sellerUrl,
          user_selection: selectedCompetitors,
          platforms: selectedPlatforms
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert("Analysis Error: " + data.error);
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
            Competitor Intelligence
          </h1>
          <p className="text-slate-400 mt-2">Find competitors, select targets, and generate benchmarks.</p>
        </header>

        <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm shadow-xl space-y-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Marketplaces</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatforms(prev => 
                        prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                      )}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                        selectedPlatforms.includes(p) 
                          ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-4">
              <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Your Product URL</label>
              <input
                type="text"
                placeholder="Paste your product URL here"
                className="w-full bg-slate-930 border-2 border-slate-800 rounded-xl px-5 py-3 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-200 placeholder:text-slate-700 shadow-inner"
                value={sellerUrl}
                onChange={(e) => setSellerUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={searchCompetitors}
                disabled={searching || !sellerUrl}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 flex-1 shadow-lg shadow-blue-500/20"
              >
                {searching ? "Finding Competitors..." : "Phase 1: Discovery"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 p-4 bg-slate-950/50 rounded-xl border border-blue-500/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">
                    Phase 2: Select Competitors ({searchResults.length} found)
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedCompetitors(selectedCompetitors.length === searchResults.length ? [] : [...searchResults]);
                    }}
                    className="text-[10px] font-black uppercase text-blue-500 hover:text-blue-400"
                  >
                    {selectedCompetitors.length === searchResults.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                  {searchResults.map((res: any, i: number) => (
                    <div 
                      key={i}
                      onClick={() => {
                        setSelectedCompetitors(prev => 
                          prev.some(p => p.url === res.url) ? prev.filter(p => p.url !== res.url) : [...prev, res]
                        );
                      }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        selectedCompetitors.some(p => p.url === res.url)
                          ? "bg-blue-600/10 border-blue-500" 
                          : "bg-slate-900 border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 ${
                        selectedCompetitors.some(p => p.url === res.url) ? "bg-blue-500 border-blue-500" : "border-slate-700"
                      }`}>
                        {selectedCompetitors.some(p => p.url === res.url) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-200 truncate leading-tight mb-1">{res.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{res.platform} • ₹{res.price}</p>
                          {res.data?.rating > 0 && (
                            <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-400">
                              <span className="text-[10px]">★</span>
                              {res.data.rating}
                            </div>
                          )}
                          {res.data?.review_count > 0 && (
                            <p className="text-[9px] text-slate-600 font-bold">({res.data.review_count})</p>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                <button
                  onClick={analyzeMarket}
                  disabled={loading || selectedCompetitors.length === 0}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {loading ? "Analyzing Selected..." : `Phase 3: Analyze ${selectedCompetitors.length} Products`}
                </button>
              </div>
            )}
          </div>
        </section>

        {results && (
          <div className="mt-8 space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                      <Bell className="w-5 h-5" />
                      Benchmarking Signals
                    </h2>
                    <ul className="space-y-4">
                      {results.signals?.map((s: string, i: number) => (
                        <li key={i} className="bg-slate-800/30 p-5 rounded-2xl text-slate-200 border border-slate-800/50 text-sm">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      Actionable Strategies
                    </h2>
                    <div className="space-y-4">
                      {results.strategies?.map((s: any, i: number) => (
                        <div key={i} className="bg-blue-900/10 p-5 rounded-2xl text-blue-100 border border-blue-800/20 text-sm">
                          <span className="block font-black text-blue-400 text-[10px] uppercase mb-1 tracking-widest">{s.strategy || "ACTION"}</span>
                          {s.action}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {results.benchmark_table_json && (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
                      <TableProperties className="w-5 h-5" />
                      Comparative Matrix
                    </h2>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-widest font-black">
                          <tr>
                            <th className="px-6 py-5">Metric</th>
                            <th className="px-6 py-5">You</th>
                            <th className="px-6 py-5">Competitor AVG</th>
                            <th className="px-6 py-5">Opportunity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {results.benchmark_table_json.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-6 py-4 font-black text-slate-200">{row.metric}</td>
                              <td className="px-6 py-4 text-emerald-400 font-bold">{row.metric === "Price (₹)" ? `₹${row.user}` : row.user}</td>
                              <td className="px-6 py-4 text-slate-400">{row.metric === "Price (₹)" ? `₹${row.avg_competitor}` : row.avg_competitor}</td>
                              <td className="px-6 py-4">
                                <span className="text-[11px] leading-relaxed px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 font-medium block">
                                  {row.opportunity}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl">
                   <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Quality Intelligence Summary</h2>
                   <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl text-emerald-200 text-sm leading-relaxed">
                      {results.quality_comparison}
                   </div>
                </div>

            <div className="bg-slate-950 border border-slate-900 p-8 rounded-3xl opacity-60">
              <h3 className="text-slate-500 text-xs font-black uppercase mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> System Logs
              </h3>
              <div className="space-y-2 font-mono text-[10px] text-slate-600">
                {results.logs?.map((log: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start border-l border-slate-800 pl-4 py-1">
                    <span className="text-slate-500">{log}</span>
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
