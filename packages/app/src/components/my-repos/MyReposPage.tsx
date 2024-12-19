import Cookies from 'universal-cookie';
import React from 'react';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';
import { Constants } from '../../constants';

//region getting repo data

/**
 * Parsing a string formatted date to a Date object.
 * @param dateStr The string formated date to parse (format = 'yyyy-MM-ddThh:mm:ssZ' 24h based).
 * @returns The parsed date, or the current date if the format wasn't respected.
 */
function formatRepoDate(dateStr: string): Date {
    if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z/.test(dateStr)) {
        return new Date(
            Number(dateStr.slice(0, 4)),
            Number(dateStr.slice(5, 7)) - 1, // Months are 0 based
            Number(dateStr.slice(8, 10)),
            Number(dateStr.slice(11, 13)),
            Number(dateStr.slice(14, 16)),
            Number(dateStr.slice(17, 19))
        );
    }
    return new Date(Date.now());
}

const cookie = new Cookies();
const username = cookie.get(Constants.GITHUB_USERNAME_COOKIE);

// Repo data
let repoData = new Array<{
    name: string,
    url: string,
    description: string,
    creationDate: Date,
    lastUpdateDate: Date
}>;

// Fetching current (GitHub) user public repo data
await fetch(`https://api.github.com/users/${username}/repos`)
    .then(res => {
        if (res.ok) return res.json();
        throw new Error;
    })
    .then(
        (data: {
            name: string,
            html_url: string,
            description: string,
            created_at: string,
            updated_at: string
        }[]) => {
            repoData = data.map(
                d => {
                    return {
                        name: d.name,
                        url: d.html_url,
                        description: d.description,
                        creationDate: formatRepoDate(d.created_at),
                        lastUpdateDate: formatRepoDate(d.updated_at)
                    };
                }
            );
        }
    ).catch(e => console.error(e));


//endregion

//region page render

/**
 * Getting a date to string.
 * @param date The date to parse.
 * @returns The parsed date (format = 'mm/dd/yyyy').
 */
function dateToString(date: Date): string {
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month >= 10 ? '' : '0'}${month}/${day >= 10 ? '' : '0'}${day}/${year}`;
}

export const MyReposPage = () => (
    <Page themeId="my-repos">
        <Header title={`My public GitHub repositories`}/>
        <Content>
            {
                repoData.length ?
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.75em'}}>
                        {repoData.map(repo => (
                            <a href={repo.url} target="_blank">
                                <InfoCard className="repo-card">
                                    <h3 style={{margin: 0}}>{repo.name}</h3>
                                    <small className="text-muted">
                                        Created {dateToString(repo.creationDate)} •
                                        Last modified {dateToString(repo.lastUpdateDate)}
                                    </small>
                                    {repo.description ? <p>{repo.description}</p> :
                                        <p className="text-muted">/</p>}
                                </InfoCard>
                            </a>
                        ))}
                    </div> :
                    <div className="text-muted"
                         style={{
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             height: '100%'
                         }}>No public repo</div>
            }
        </Content>
    </Page>
);

//endregion