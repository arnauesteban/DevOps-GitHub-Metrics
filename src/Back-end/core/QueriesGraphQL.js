import { github_data } from "../utils/github-config.js"

const QUERY_GRAPHQL = {
    SNAPSHOT : `query {
        repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
          projectV2(number: 2) {
            items(first: 100) {
              nodes {
                status: fieldValueByName(name: "Status") {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    column: name
                  }
                }
              }
            }
          }
        }
    }`,
    
    ALL_ISSUES : `query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            projectV2(number: 2) {
                title
                items(first: 100) {
                    nodes {
                        content {
                            ... on Issue {
                                id
                                number
                                title
                                state
                                createdAt
                                closedAt
                            }
                        }
                        status: fieldValueByName(name: "Status") {
                            ... on ProjectV2ItemFieldSingleSelectValue {
                                column: name
                            }
                        }
                    }
                }
            }
        }
    }`,

    CLOSED_ISSUES : `query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            issues(
                states : CLOSED
                first: 100
            ) {
                nodes {
                    id
                    number
                    title
                    createdAt
                    closedAt
                }
            }
        }
    }`,

    ALL_PR : `query {
        repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
            pullRequests(first: 100) {
                nodes{
                    id
                    number
                    title
                    state
                    createdAt
                    closedAt
                    author{
                        login
                    }
                }
            }
        }
    }`,

    SUCCESSFULLY_MERGED_PR : `query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            successfulPullRequests: pullRequests(states: [MERGED]) {
                totalCount
            }
            totalClosedPullRequests: pullRequests(states: [CLOSED, MERGED]) {
                totalCount
            }
        }
    }`,

    CURRENTLY_OPENED_VS_TOTAL_PR : `query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            openPullRequests: pullRequests(states: [OPEN]) {
                totalCount
            }
            totalPullRequests: pullRequests(states: [OPEN, CLOSED, MERGED]) {
                totalCount
            }
        }
    }`,

    AUTHORS_OF_PR : `query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            pullRequests(first: 100, states: [OPEN, CLOSED, MERGED]) {
                totalCount,
                nodes {
                    author {
                        login
                    }
                }
            }
        }
    }`,
}

export const getIssueGraphQLQuery = (id) => {
    return(`query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            issue(number: ${id}) {
  				id
                number
        		title
        		createdAt
        		closedAt
        		state
        		labels(first:10){
                    nodes{
                        name
                    }
                }
        		body
            }
        }
    }`);
}

export const getPRGraphQLQuery = (prID) => {
    return(`query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            pullRequest(number: ${prID}) {
                number
                title
                createdAt
                closedAt
            }
        }
    }`)
}

export const getPRsMeanTimeInfo = (nb_of_PR) => {
    return(`query {
        repository(owner: "${github_data.username}", name: "${github_data.repo}") {
            pullRequests(first: ${nb_of_PR}, states: MERGED, orderBy : {field : CREATED_AT, direction :DESC}) {
                edges {
                    node {
                        title
                        createdAt
                        mergedAt
                    }
                }
            }
        }
    }`)
}

export default QUERY_GRAPHQL;

