// github-config.js
import fetch from 'node-fetch'

const github_data = {
    "token" : "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",
    "username" : "arnauesteban"
};

export const body = {
    "query" : `
    query {
        repository(owner: "arnauesteban", name: "labo-devops-g14-a23") {
            issues(first: 4) {
                nodes {
                    title
                    closedAt
                }
            }
        }
    }
    `
};

const baseUrl = "https://api.github.com/graphql";

const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + github_data["token"]
};

export async function sendGitHubQuery(query) {
    try {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Erreur lors d'envoyer la query a GitHub: ${error.message}`);
    }
}