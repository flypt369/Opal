// Real-time Privacy Metrics Component for Opal
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Info, TrendingUp, Lock, Eye, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card.jsx';
import { Badge } from './badge.jsx';
import { Progress } from './progress.jsx';

export function PrivacyMetricsPanel({ results, dashboardData, className = "" }) {
  const [metrics, setMetrics] = useState(null);
  const [animatedScores, setAnimatedScores] = useState({});

  useEffect(() => {
    if (results && results.length > 0) {
      const aggregatedMetrics = calculateAggregatedMetrics(results);
      setMetrics(aggregatedMetrics);
      animateScores(aggregatedMetrics);
    }
  }, [results]);

  const calculateAggregatedMetrics = (results) => {
    const totalFiles = results.length;
    const avgPrivacyScore = Math.round(
      results.reduce((sum, r) => sum + (r.analysis?.privacyScore || 0), 0) / totalFiles
    );

    const allTechniques = new Set();
    const allPIIFields = [];
    const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    const complianceFrameworks = {};

    results.forEach(result => {
      const analysis = result.analysis;
      
      // Collect privacy techniques
      if (analysis.recommendedTechniques) {
        analysis.recommendedTechniques.forEach(tech => allTechniques.add(tech.technique));
      }

      // Collect PII fields
      if (analysis.sensitivityAnalysis?.piiFields) {
        allPIIFields.push(...analysis.sensitivityAnalysis.piiFields);
      }

      // Count risk levels
      if (analysis.riskLevel) {
        riskCounts[analysis.riskLevel]++;
      }

      // Aggregate compliance scores
      if (analysis.complianceScores) {
        Object.entries(analysis.complianceScores).forEach(([framework, data]) => {
          if (!complianceFrameworks[framework]) {
            complianceFrameworks[framework] = { total: 0, count: 0 };
          }
          complianceFrameworks[framework].total += data.score;
          complianceFrameworks[framework].count++;
        });
      }
    });

    // Calculate average compliance scores
    const avgComplianceScores = {};
    Object.entries(complianceFrameworks).forEach(([framework, data]) => {
      avgComplianceScores[framework] = Math.round(data.total / data.count);
    });

    const overallRisk = avgPrivacyScore >= 85 ? 'LOW' : avgPrivacyScore >= 70 ? 'MEDIUM' : 'HIGH';

    return {
      totalFiles,
      avgPrivacyScore,
      overallRisk,
      totalPIIFields: allPIIFields.length,
      uniquePIITypes: new Set(allPIIFields.map(f => f.type)).size,
      privacyTechniques: Array.from(allTechniques),
      riskDistribution: riskCounts,
      complianceScores: avgComplianceScores,
      encryptionStrength: Math.round(
        results.reduce((sum, r) => sum + (r.analysis?.metrics?.encryptionStrength || 256), 0) / totalFiles
      ),
      anonymizationLevel: Math.round(
        results.reduce((sum, r) => sum + (r.analysis?.metrics?.anonymizationLevel || 85), 0) / totalFiles
      )
    };
  };

  const animateScores = (newMetrics) => {
    // Animate score changes for visual impact
    const scores = {
      privacy: newMetrics.avgPrivacyScore,
      encryption: newMetrics.encryptionStrength,
      anonymization: newMetrics.anonymizationLevel
    };

    Object.entries(scores).forEach(([key, targetValue]) => {
      let currentValue = 0;
      const increment = targetValue / 50; // Animate over 50 steps
      
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(timer);
        }
        
        setAnimatedScores(prev => ({
          ...prev,
          [key]: Math.round(currentValue)
        }));
      }, 20);
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'CRITICAL': return 'text-red-800 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'LOW': return <CheckCircle2 className="w-4 h-4" />;
      case 'MEDIUM': return <Info className="w-4 h-4" />;
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />;
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (!metrics) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Privacy Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Upload and analyze files to see real-time privacy metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Privacy Score */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Overall Privacy Score
            </span>
            <Badge className={`${getRiskColor(metrics.overallRisk)} border`}>
              {getRiskIcon(metrics.overallRisk)}
              <span className="ml-1">{metrics.overallRisk} RISK</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-bold text-blue-600">
              {animatedScores.privacy || metrics.avgPrivacyScore}%
            </span>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <Progress 
            value={animatedScores.privacy || metrics.avgPrivacyScore} 
            className="h-3 mb-2" 
          />
          <p className="text-xs text-muted-foreground">
            Based on {metrics.totalFiles} file(s) with comprehensive privacy analysis
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">PII Fields</p>
                <p className="text-2xl font-bold">{metrics.totalPIIFields}</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.uniquePIITypes} unique types
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Encryption</p>
                <p className="text-2xl font-bold">
                  {animatedScores.encryption || metrics.encryptionStrength}
                </p>
                <p className="text-xs text-muted-foreground">bit strength</p>
              </div>
              <Lock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Anonymization</p>
                <p className="text-2xl font-bold">
                  {animatedScores.anonymization || metrics.anonymizationLevel}%
                </p>
                <p className="text-xs text-muted-foreground">level</p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Techniques</p>
                <p className="text-2xl font-bold">{metrics.privacyTechniques.length}</p>
                <p className="text-xs text-muted-foreground">applied</p>
              </div>
              <Shield className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Scores */}
      {Object.keys(metrics.complianceScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(metrics.complianceScores).map(([framework, score]) => (
                <div key={framework} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{framework}</span>
                    <Badge variant={score >= 85 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}>
                      {score}%
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Techniques */}
      {metrics.privacyTechniques.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Applied Privacy Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {metrics.privacyTechniques.map((technique, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {technique.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(metrics.riskDistribution).map(([risk, count]) => (
              count > 0 && (
                <div key={risk} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(risk)}
                    <span className="text-sm font-medium">{risk} Risk Files</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Progress 
                      value={(count / metrics.totalFiles) * 100} 
                      className="w-20 h-2" 
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}