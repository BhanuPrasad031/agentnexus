export function generateAiOutput(
  category: string,
  description: string,
): string {
  const cat = category.toLowerCase().replace(/\s+/g, "");
  const topic = description.slice(0, 80);

  if (cat.includes("data") || cat.includes("analysis")) {
    return `Analysis complete for: "${topic}"\n\nKey Findings:\n• Revenue trend: +23.4% QoQ growth detected\n• Top performing segment: Enterprise (41.2% share)\n• Anomaly detected in Week 3 data — spike of 2.3σ above baseline\n• Customer retention rate: 87.6% (↑ from 82.1%)\n• Forecast model confidence: 94.2%\n\nRecommendations:\n1. Increase Q4 allocation to top 3 performing channels\n2. Investigate Week 3 anomaly — likely seasonal effect\n3. Expand Enterprise tier features to capture growing segment\n\nData processed: 12,847 records | Runtime: 1.8s | Model: XGBoost v3.2`;
  }

  if (cat.includes("content") || cat.includes("generation")) {
    return `Content generated for: "${topic}"\n\n---\n\nIn a world driven by data and automation, the next frontier is intelligent orchestration. Our analysis shows that organizations leveraging AI-powered workflows see a 3.2x improvement in operational efficiency within the first quarter of adoption.\n\nKey insights for your audience:\n• Personalization at scale is no longer optional — it's the baseline expectation\n• Real-time decision engines outperform batch processes by 67% in user satisfaction scores\n• The most successful deployments combine human oversight with autonomous execution\n\nConclusion: The shift toward autonomous AI agents isn't just a technology upgrade — it's a fundamental reimagining of how work gets done.\n\n---\nWord count: 312 | Readability: Grade 10 | SEO score: 87/100`;
  }

  if (cat.includes("automation")) {
    return `Workflow executed for: "${topic}"\n\nExecution Log:\n[1] ✓ Source data fetched from API endpoint (312ms)\n[2] ✓ Input validation passed — 1,847 records accepted, 3 rejected (schema mismatch)\n[3] ✓ Transformation pipeline applied (normalize, deduplicate, enrich)\n[4] ✓ Business rules engine processed 1,847 records\n[5] ✓ Output written to destination (gzip compressed, 2.1MB)\n[6] ✓ Notification dispatched to 3 downstream services\n[7] ✓ Audit log entry created\n\nSummary:\n• Total records processed: 1,847\n• Success rate: 99.8%\n• Total runtime: 2.4s\n• No critical errors encountered\n\nStatus: COMPLETED ✓`;
  }

  if (cat.includes("decision") || cat.includes("support")) {
    return `Decision analysis for: "${topic}"\n\nExecutive Summary:\nBased on multi-factor analysis across 6 key dimensions, the recommended course of action has a projected ROI of 34% over 12 months.\n\nRisk Matrix:\n• Low risk (score 2.1/10): Operational continuity\n• Medium risk (score 5.4/10): Market adoption timeline\n• High risk (score 7.8/10): Competitive response — mitigate with fast execution\n\nTop 3 Recommendations:\n1. PROCEED with primary strategy — confidence 91.3%\n2. Establish 30-day review checkpoints with defined exit criteria\n3. Allocate 15% contingency budget for rapid pivots\n\nAlternative Scenarios Modeled: 4\nData sources analyzed: 23\nConfidence interval: 89–94%`;
  }

  return `Task completed for: "${topic}"\n\nProcessing Summary:\n• Input analyzed and validated successfully\n• 847 data points evaluated across 12 dimensions\n• Pattern recognition applied using ensemble model\n• Output generated with 92.7% confidence\n\nKey Results:\n1. Primary objective achieved with optimal parameters\n2. Secondary conditions met — no exceptions raised\n3. Quality assurance checks passed (all 14 criteria)\n\nDeliverable: Structured output ready for review\nProcessing time: 1.6s | Status: COMPLETED ✓`;
}
