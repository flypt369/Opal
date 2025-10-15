import { useState } from 'react'
import { Upload, Shield, Brain, FileText, Image, Mic, Database, Lock, CheckCircle2, AlertCircle, Sparkles, FileCode, Presentation, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [privacyMetrics, setPrivacyMetrics] = useState({
    piiDetected: 0,
    piiRedacted: 0,
    dataProcessedLocally: true,
    encryptionEnabled: true
  })

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const handleAnalyze = async () => {
    setProcessing(true)
    setProgress(0)
    
    // Simulate multi-step processing
    const steps = [
      { name: 'Ingesting multi-modal data', duration: 1000 },
      { name: 'Applying privacy redaction', duration: 1500 },
      { name: 'Building knowledge graph', duration: 2000 },
      { name: 'Performing multi-step reasoning', duration: 2500 },
      { name: 'Generating outputs', duration: 1500 }
    ]
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration))
      setProgress(((i + 1) / steps.length) * 100)
    }
    
    setPrivacyMetrics({
      piiDetected: Math.floor(Math.random() * 20) + 5,
      piiRedacted: Math.floor(Math.random() * 20) + 5,
      dataProcessedLocally: true,
      encryptionEnabled: true
    })
    
    setProcessing(false)
    setAnalysisComplete(true)
  }

  const fileTypeIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return <Image className="w-4 h-4" />
    if (fileName.match(/\.(mp3|wav|m4a)$/i)) return <Mic className="w-4 h-4" />
    if (fileName.match(/\.(pdf|doc|docx)$/i)) return <FileText className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Opal
                </h1>
                <p className="text-xs text-muted-foreground">Privacy-Preserving Business Analyst</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Lock className="w-3 h-3" />
                Zero Data Retention
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Shield className="w-3 h-3" />
                On-Device Processing
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            From Messy Data to Boardroom-Ready Insights
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Autonomously ingest, reason over, and act on multi-modal business data—without ever leaking your secrets.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Upload Section */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Multi-Modal Data Ingestion
              </CardTitle>
              <CardDescription>
                Upload PDFs, images, audio files, spreadsheets, and text documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.mp3,.wav,.txt,.csv,.xlsx,.docx"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground">
                    Supports: PDF, Images, Audio, Spreadsheets, Documents
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Uploaded Files ({files.length})</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        {fileTypeIcon(file.name)}
                        <span className="text-sm flex-1 truncate">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleAnalyze} 
                disabled={files.length === 0 || processing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {processing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze with Opal
                  </>
                )}
              </Button>

              {processing && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing...</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Metrics */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Privacy Status
              </CardTitle>
              <CardDescription>Real-time privacy protection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Local Processing</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Encryption</span>
                  </div>
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    Enabled
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">PII Detected</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {privacyMetrics.piiDetected}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">PII Redacted</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                    {privacyMetrics.piiRedacted}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-muted-foreground">
                  All sensitive data is processed locally on your device. No data is transmitted to external servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {analysisComplete && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Analysis Results
              </CardTitle>
              <CardDescription>Multi-modal outputs generated by Opal</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="memo" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="memo" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Memo
                  </TabsTrigger>
                  <TabsTrigger value="slides" className="gap-2">
                    <Presentation className="w-4 h-4" />
                    Slides
                  </TabsTrigger>
                  <TabsTrigger value="script" className="gap-2">
                    <FileCode className="w-4 h-4" />
                    Script
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="gap-2">
                    <Volume2 className="w-4 h-4" />
                    Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="memo" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Executive Strategic Memo</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-sm leading-relaxed">
                        <strong>Subject:</strong> Q3 Revenue Analysis and Strategic Recommendations
                      </p>
                      <p className="text-sm leading-relaxed mt-4">
                        Based on comprehensive analysis of uploaded financial documents, meeting transcripts, and market data, 
                        Opal has identified a 12% revenue decline in the APAC region during Q3 2025. This decline is primarily 
                        attributed to increased competition and supply chain disruptions.
                      </p>
                      <p className="text-sm leading-relaxed mt-4">
                        <strong>Key Findings:</strong>
                      </p>
                      <ul className="text-sm space-y-2 mt-2">
                        <li>APAC revenue decreased from $4.2M to $3.7M (12% decline)</li>
                        <li>Customer acquisition costs increased by 18%</li>
                        <li>Supply chain delays impacted 23% of orders</li>
                        <li>Competitor pricing strategies gained market share</li>
                      </ul>
                      <p className="text-sm leading-relaxed mt-4">
                        <strong>Recommendations:</strong> Implement dynamic pricing strategy, diversify supplier network, 
                        and increase marketing investment in high-growth segments.
                      </p>
                      <p className="text-xs text-muted-foreground mt-6">
                        <em>All PII/PHI has been automatically redacted. Sources: Q3_Financial_Report.pdf (p.12), 
                        Board_Meeting_Transcript.txt, Market_Analysis.xlsx</em>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Full Memo (PDF)
                  </Button>
                </TabsContent>

                <TabsContent value="slides" className="space-y-4 mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((slide) => (
                      <div key={slide} className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-4 border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform cursor-pointer">
                        <div className="text-xs font-medium mb-2">Slide {slide}</div>
                        <div className="h-full flex items-center justify-center">
                          <Presentation className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <Presentation className="w-4 h-4 mr-2" />
                    Download Presentation (PPTX)
                  </Button>
                </TabsContent>

                <TabsContent value="script" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg font-mono text-xs">
                    <pre className="overflow-x-auto">
{`# SQL Query to Validate Q3 Revenue Hypothesis
SELECT 
    region,
    SUM(revenue) as total_revenue,
    COUNT(DISTINCT customer_id) as unique_customers,
    AVG(order_value) as avg_order_value
FROM sales_data
WHERE quarter = 'Q3' AND year = 2025
GROUP BY region
ORDER BY total_revenue DESC;

# Python Script for Trend Analysis
import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('q3_sales.csv')

# Calculate YoY growth
df['yoy_growth'] = ((df['q3_2025'] - df['q3_2024']) / df['q3_2024']) * 100

# Generate visualization
plt.figure(figsize=(10, 6))
plt.bar(df['region'], df['yoy_growth'])
plt.title('Q3 YoY Revenue Growth by Region')
plt.xlabel('Region')
plt.ylabel('Growth (%)')
plt.savefig('revenue_growth.png')
`}
                    </pre>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileCode className="w-4 h-4 mr-2" />
                    Download Scripts (.py, .sql)
                  </Button>
                </TabsContent>

                <TabsContent value="audio" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg text-center">
                    <Volume2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-bold mb-2">Executive Voice Summary</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      A concise 2-minute audio summary of key findings and recommendations for executives on the go.
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Button size="lg" className="rounded-full w-16 h-16">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 max-w-md mx-auto">
                      <span className="text-xs">0:00</span>
                      <Progress value={0} className="flex-1" />
                      <span className="text-xs">2:15</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Download Audio Summary (MP3)
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <Brain className="w-10 h-10 mb-2 text-blue-600" />
              <CardTitle className="text-lg">Multi-Step Reasoning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Plans, validates, and iterates like a human consultant. Builds knowledge graphs and asks clarifying questions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <Shield className="w-10 h-10 mb-2 text-green-600" />
              <CardTitle className="text-lg">Privacy by Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                On-device processing, automatic PII/PHI redaction, zero data retention, and MCP-powered secure API access.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Database className="w-10 h-10 mb-2 text-purple-600" />
              <CardTitle className="text-lg">MCP Tool Orchestration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dynamic tool discovery and secure integration with enterprise APIs (CRM, ERP) without hardcoded credentials.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-12 py-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Opal - Privacy-Preserving Multi-Modal Business Analyst Agent
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Built with LangGraph, Llama 3.2, Qwen-VL, Whisper, and MCP | Healthcare Revenue Cycle Management Demo
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

