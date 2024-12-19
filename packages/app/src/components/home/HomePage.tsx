import React from 'react';
import { Content, InfoCard } from '@backstage/core-components';

const favoriteProjects = [
  { name: 'Example - Backstage', link: '/catalog/default/component/example-website' },
  { name: 'Repository from Node.js template', link: '/catalog/default/component/infos-backstage' },
];

const serviceStatuses = [
  { name: 'Service A', status: 'Healthy' },
  { name: 'Service B', status: 'Degraded' },
];

export const HomePage = () => (
  <Content>
    <h1>Welcome to Backstage! </h1>
    <InfoCard title="My Favorite Projects">
      <ul>
        {favoriteProjects.map(project => (
          <li key={project.name}>
            <a href={project.link}>{project.name}</a>
          </li>
        ))}
      </ul>
    </InfoCard>
    <br/>
    <InfoCard title="Service Status">
      <ul>
        {serviceStatuses.map(service => (
          <li key={service.name}>
            {service.name}: <strong>{service.status}</strong>
          </li>
        ))}
      </ul>
    </InfoCard>
    <br/>
  </Content>
);
