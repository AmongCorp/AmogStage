import React from 'react';
import { Content, Header, InfoCard, Page } from '@backstage/core-components';

//region data placeholders

const favoriteProjects = [
    {name: 'Project A', link: '/catalog/default/component/example-website'},
    {name: 'Project B', link: '/catalog/default/component/project-b'}
];

const serviceStatuses = [
    {name: 'Service A', status: 'Healthy'},
    {name: 'Service B', status: 'Degraded'}
];

//endregion

//region tisséo métro data display

/**
 * Parsing a string formatted date to a Date object.
 * @param dateStr The string formated date to parse (format = 'yyyyMMddThhmmss').
 * @returns The parsed date, or the current date if the format wasn't respected.
 */
function formatTisseoDate(dateStr: string): Date {
    if (/[0-9]{8}T[0-9]{6}/.test(dateStr)) {
        return new Date(
            Number(dateStr.slice(0, 4)),
            Number(dateStr.slice(4, 6)) - 1, // Months are 0 based
            Number(dateStr.slice(6, 8)),
            Number(dateStr.slice(9, 11)),
            Number(dateStr.slice(11, 13)),
            Number(dateStr.slice(13, 15))
        );
    }
    return new Date(Date.now());
}

// Tisséo metro data
const metroData = {
    directionA: {
        destination: "",
        schedules: new Array<Date>
    },
    directionB: {
        destination: "",
        schedules: new Array<Date>
    }
};

// Fetching Tisséo métro data for destination A
await fetch('https://plan-interactif.tisseo.fr/api/schedules?stop=stop_point:SP_2860&route=line:69_f&date=&count=6&withScheduleDestination=true&area=stop_area:SA_1072&line=line:69')
    .then(res => {
        if (res.ok) return res.json();
        throw new Error;
    })
    .then(
        (data: { date_time: string, destination: string }[]) => {
            if (data.length) {
                metroData.directionA.destination = data[0].destination;
                metroData.directionA.schedules = data.map(d => formatTisseoDate(d.date_time));
            }
        }
    ).catch(e => console.error(e));

// Fetching Tisséo métro data for destination B
await fetch('https://plan-interactif.tisseo.fr/api/schedules?stop=stop_point:SP_56&route=line:69_b&date=&count=6&withScheduleDestination=true&area=stop_area:SA_1072&line=line:69')
    .then(res => {
        if (res.ok) return res.json();
        throw new Error;
    })
    .then(
        (data: { date_time: string, destination: string }[]) => {
            if (data.length) {
                metroData.directionB.destination = data[0].destination;
                metroData.directionB.schedules = data.map(d => formatTisseoDate(d.date_time));
            }
        }
    )
    .catch(e => console.error(e));

//endregion

//region page render

/**
 * Getting a date time to string.
 * @param date The date to parse.
 * @returns The time of the given date (format = 'hhhmm' 24h based).
 */
function dateTimeToString(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours >= 10 ? '' : '0'}${hours}h${minutes >= 10 ? '' : '0'}${minutes}`;
}

export const HomePage = () => (
    <Page themeId="home">
        <Header title="Welcome to AmogStage!"/>
        <Content>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.75em'}}>

                <InfoCard title="My favorite projects">
                    <ul>
                        {favoriteProjects.map(project => (
                            <li key={project.name}>
                                <a href={project.link}>{project.name}</a>
                            </li>
                        ))}
                    </ul>
                </InfoCard>

                <InfoCard title="Service status">
                    <ul>
                        {serviceStatuses.map(service => (
                            <li key={service.name}>
                                {service.name}: <strong>{service.status}</strong>
                            </li>
                        ))}
                    </ul>
                </InfoCard>

                <InfoCard title="Coming Tisséo métro departures">
                    <h3>Compans Caffarelli (B line)</h3>
                    <ul>
                        <li>
                            To <u>{metroData.directionA.destination}</u>:
                            <b>{metroData.directionA.schedules.map(
                                (d, i) => ` ${dateTimeToString(d)}${i < metroData.directionA.schedules.length - 1 ? ',' : ''}`
                            )}</b>
                        </li>
                        <li>
                            To <u>{metroData.directionB.destination}</u>:
                            <b>{metroData.directionB.schedules.map(
                                (d, i) => ` ${dateTimeToString(d)}${i < metroData.directionB.schedules.length - 1 ? ',' : ''}`
                            )}</b>
                        </li>
                    </ul>
                </InfoCard>

            </div>
        </Content>
    </Page>
);

//endregion
