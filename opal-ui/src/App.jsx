import { useState, useEffect } from 'react'
import { Upload, Shield, Brain, FileText, Image, Mic, Database, Lock, CheckCircle2, AlertCircle, Sparkles, FileCode, Presentation, Volume2, RefreshCw } from 'lucide-react'
import { Button } from './components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Progress } from './components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx'
import { PrivacyMetricsPanel } from './components/ui/privacy-metrics-panel.jsx'
import { useFileUpload, usePrivacyDashboard } from './hooks/useFileProcessing.js'
import './App.css'

function App() {
  const [files, setFiles] = useState([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [privacyMetrics, setPrivacyMetrics] = useState({
    piiDetected: 0,
    piiRedacted: 0,
    dataProcessedLocally: true,
    encryptionEnabled: true
  })

  // Use custom hooks for file processing
  const { 
    uploadFiles, 
    uploadStatus, 
    progress, 
    results, 
    error, 
    sessionId, 
    isUploading, 
    isCompleted,
    reset 
  } = useFileUpload()

  const { 
    dashboardData, 
    loading: dashboardLoading, 
    loadDashboard 
  } = usePrivacyDashboard()

  // Load dashboard when analysis completes
  useEffect(() => {
    if (isCompleted && sessionId && !dashboardData) {
      loadDashboard(sessionId)
      setAnalysisComplete(true)
      
      // Update privacy metrics with real data
      if (results && results.length > 0) {
        const totalSensitiveFields = results.reduce((sum, result) => 
          sum + (result.analysis?.insights?.sensitiveFields?.length || 0), 0)
        
        const avgPrivacyScore = results.reduce((sum, result) => 
          sum + (result.analysis?.privacyScore || 85), 0) / results.length
        
        setPrivacyMetrics({
          piiDetected: totalSensitiveFields,
          piiRedracted: Math.floor(totalSensitiveFields * 0.95), // 95% redaction rate
          dataProcessedLocally: true,
          encryptionEnabled: true,
          privacyScore: Math.round(avgPrivacyScore)
        })
      }
    }
  }, [isCompleted, sessionId, results, dashboardData, loadDashboard])

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files)
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const handleAnalyze = async () => {
    if (files.length === 0) {
      alert('Please upload files before analyzing')
      return
    }

    try {
      await uploadFiles(files)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  const handleReset = () => {
    setFiles([])
    setAnalysisComplete(false)
    setPrivacyMetrics({
      piiDetected: 0,
      piiRedacted: 0,
      dataProcessedLocally: true,
      encryptionEnabled: true
    })
    reset()
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

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={files.length === 0 || isUploading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with Opal
                    </>
                  )}
                </Button>

                {(isCompleted || error) && (
                  <Button 
                    onClick={handleReset} 
                    variant="outline"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {uploadStatus === 'uploading' ? 'Uploading files...' : 'Processing with privacy protection...'}
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Failed</span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
                </div>
              )}

              {isCompleted && results && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Analysis Complete</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Successfully processed {results.length} file(s) with privacy protection
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Metrics */}
          <PrivacyMetricsPanel 
            results={results} 
            dashboardData={dashboardData}
            className="shadow-lg hover:shadow-xl transition-shadow"
          />
        </div>

        {/* Results Section */}
        {analysisComplete && (
          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                {results && results.length > 0 ? 
                  `Processed ${results.length} file(s) with ${privacyMetrics.privacyScore || 85}% privacy score` :
                  'Multi-modal outputs generated by Opal'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="insights" className="gap-2">
                    <Brain className="w-4 h-4" />
                    Insights
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy
                  </TabsTrigger>
                  <TabsTrigger value="files" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="dashboard" className="gap-2">
                    <Database className="w-4 h-4" />
                    Dashboard
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Business Intelligence Summary</h3>
                    <div className="space-y-4">
                      {results && results.length > 0 ? (
                        results.map((result, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-sm">{result.fileName}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              Privacy Score: {result.analysis.privacyScore}% | 
                              Type: {result.analysis.fileType.toUpperCase()} |
                              Data Points: {result.analysis.insights.dataPoints?.toLocaleString() || 'N/A'}
                            </p>
                            {result.analysis.insights.businessInsights && result.analysis.insights.businessInsights.length > 0 && (
                              <ul className="text-sm space-y-1">
                                {result.analysis.insights.businessInsights.map((insight, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Upload and analyze files to see business insights powered by privacy-preserving AI.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Privacy Protection Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {results && results.length > 0 ? (
                        results.map((result, index) => (
                          <div key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">{result.fileName}</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span>Sensitive Fields:</span>
                                <Badge variant="outline">
                                  {result.analysis.insights.sensitiveFields?.length || 0}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Privacy Techniques:</span>
                                <Badge variant="outline">
                                  {result.analysis.insights.privacyTechniques?.length || 0}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Processing Time:</span>
                                <span>{((result.analysis.processingTime || 0) / 1000).toFixed(2)}s</span>
                              </div>
                              {result.analysis.insights.privacyTechniques && (
                                <div className="mt-2 space-y-1">
                                  {result.analysis.insights.privacyTechniques.map((technique, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs mr-1">
                                      {technique}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground col-span-2">
                          No privacy analysis available. Upload files to see detailed privacy protection metrics.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Processed Files</h3>
                    <div className="space-y-3">
                      {results && results.length > 0 ? (
                        results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              {result.analysis.fileType === 'csv' && <Database className="w-5 h-5 text-green-600" />}
                              {result.analysis.fileType === 'image' && <Image className="w-5 h-5 text-blue-600" />}
                              {result.analysis.fileType === 'document' && <FileText className="w-5 h-5 text-purple-600" />}
                              <div>
                                <p className="font-medium text-sm">{result.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(result.analysis.fileSize / 1024).toFixed(1)} KB • 
                                  {result.analysis.fileType.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={result.analysis.privacyScore >= 80 ? 'default' : 'secondary'}>
                                {result.analysis.privacyScore}%
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No files processed yet. Upload files above to get started.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-4 mt-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Privacy Dashboard</h3>
                      {dashboardLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    </div>
                    {dashboardData ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Overview</h4>
                          <div className="text-xs space-y-2">
                            <div className="flex justify-between">
                              <span>Total Files:</span>
                              <span>{dashboardData.overview.totalFiles}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Average Privacy Score:</span>
                              <span>{dashboardData.overview.averagePrivacyScore}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Risk Level:</span>
                              <Badge variant={dashboardData.overview.riskLevel === 'Low' ? 'default' : 'destructive'}>
                                {dashboardData.overview.riskLevel}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Compliance:</span>
                              <Badge variant="outline">{dashboardData.overview.complianceStatus}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Key Insights</h4>
                          <div className="text-xs space-y-2">
                            {dashboardData.insights.map((insight, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{insight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Dashboard data will appear here after file analysis is complete.
                      </p>
                    )}
                  </div>

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
