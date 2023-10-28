const QUERY_DB = {
    CREATE_METRICS_SNAPSHOT : 'INSERT INTO metricssnapshot(ProjectID, Timestamp, Backlog, A_Faire, En_Cours, Revue, Complété) VALUES( ? , ? , ? , ? , ? , ? , ?)',
    CREATE_METRICS_ISSUE : 'INSERT INTO metricsissueslt(IssueID, Title, Timestamp, LeadTime) VALUES( ? , ? , ? , ?)',
    CREATE_METRICS_PR : 'INSERT INTO metricsprlt(PullRequestID, Title, Timestamp, LeadTime) VALUES( ? , ? , ? , ?)'
}

export default QUERY_DB;