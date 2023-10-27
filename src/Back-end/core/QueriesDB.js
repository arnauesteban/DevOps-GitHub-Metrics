const QUERY_DB = {
    CREATE_METRICS_SNAPSHOT : 'INSERT INTO metricssnapshot(ProjectID, Timestamp, Backlog, A_Faire, En_Cours, Revue, Complete) VALUES( ? , ? , ? , ? , ? , ? , ?)',
    CREATE_METRICS_ISSUE : 'INSERT INTO metricsissueslt(issueID, Timestamp, Description, LeadTime) VALUES( ? , ? , ? , ?)',
    CREATE_METRICS_PR : 'INSERT INTO metricsprlt(PullRequestID, Timestamp, Description, LeadTime) VALUES( ? , ? , ? , ?)'
}

export default QUERY_DB;