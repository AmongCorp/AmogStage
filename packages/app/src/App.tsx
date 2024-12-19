import Cookies from 'universal-cookie';
import './App.css';
import React from 'react';
import { Route } from 'react-router-dom';
import { apiDocsPlugin, ApiExplorerPage } from '@backstage/plugin-api-docs';
import { CatalogEntityPage, CatalogIndexPage, catalogPlugin } from '@backstage/plugin-catalog';
import { CatalogImportPage, catalogImportPlugin } from '@backstage/plugin-catalog-import';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { orgPlugin } from '@backstage/plugin-org';
import { SearchPage } from '@backstage/plugin-search';
import { TechDocsIndexPage, techdocsPlugin, TechDocsReaderPage } from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
import { searchPage } from './components/search/SearchPage';
import { Root } from './components/Root';

import { AlertDisplay, OAuthRequestDialog, SignInPage } from '@backstage/core-components';
import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';
import { configApiRef, githubAuthApiRef, googleAuthApiRef, useApi } from '@backstage/core-plugin-api';

/* custom things */
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import { myTheme } from './components/theme/myTheme';
import { FestiveFun } from 'backstage-plugin-festive-fun';
import { UnifiedThemeProvider } from '@backstage/theme';
import LightIcon from '@material-ui/icons/WbSunny';
import { MyReposPage } from './components/my-repos/MyReposPage';
import { Constants } from './constants';

const cookie = new Cookies();
let username = cookie.get(Constants.GITHUB_USERNAME_COOKIE);

const app = createApp({
    apis,
    bindRoutes({bind}) {
        bind(catalogPlugin.externalRoutes, {
            createComponent: scaffolderPlugin.routes.root,
            viewTechDoc: techdocsPlugin.routes.docRoot,
            createFromTemplate: scaffolderPlugin.routes.selectedTemplate
        });
        bind(apiDocsPlugin.externalRoutes, {
            registerApi: catalogImportPlugin.routes.importPage
        });
        bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
            viewTechDoc: techdocsPlugin.routes.docRoot
        });
        bind(orgPlugin.externalRoutes, {
            catalogIndex: catalogPlugin.routes.catalogIndex
        });
    },
    components: {
        SignInPage: props => {
            const configApi = useApi(configApiRef);
            if (configApi.getString('auth.environment') === 'development') {
                return (
                    <SignInPage
                        {...props}
                        providers={[
                            'guest',
                            {
                                id: 'github-auth-provider',
                                title: 'GitHub',
                                message: 'Sign in using GitHub',
                                apiRef: githubAuthApiRef
                            }
                        ]}
                        onSignInSuccess={
                            async identityApi => {
                                let refresh: boolean;

                                // GitHub connection
                                if ((await identityApi.getProfileInfo())?.displayName) {
                                    const newUsername = username = (
                                        await identityApi.getBackstageIdentity()
                                    ).userEntityRef.replace('user:default/', '');
                                    refresh = !username || username != newUsername;
                                    if (refresh) cookie.set(Constants.GITHUB_USERNAME_COOKIE, username, {path: '/'});
                                }

                                // Default connection
                                else {
                                    refresh = !!username;
                                    if (refresh) cookie.remove(Constants.GITHUB_USERNAME_COOKIE);
                                }

                                // Reloading if the current user changed
                                if (refresh) location.reload();

                                props.onSignInSuccess(identityApi);
                            }
                        }
                    />
                );
            }
            return (
                <SignInPage
                    {...props}
                    provider={{
                        id: 'google-auth-provider',
                        title: 'Google',
                        message: 'Sign In using Google',
                        apiRef: googleAuthApiRef
                    }}
                />
            );
        }
    },
    themes: [{
        id: 'my-theme',
        title: 'My Custom Theme',
        variant: 'light',
        icon: <LightIcon/>,
        Provider: ({children}) => (
            <UnifiedThemeProvider theme={myTheme} children={children}/>
        )
    }]
});

const routes = (
    <FlatRoutes>
        <Route path="/" element={<HomepageCompositionRoot/>}>
            <HomePage/>
        </Route>
        <Route path="/catalog" element={<CatalogIndexPage/>}/>
        <Route
            path="/catalog/:namespace/:kind/:name"
            element={<CatalogEntityPage/>}
        >
            {entityPage}
        </Route>
        <Route path="/docs" element={<TechDocsIndexPage/>}/>
        <Route
            path="/docs/:namespace/:kind/:name/*"
            element={<TechDocsReaderPage/>}
        >
            <TechDocsAddons>
                <ReportIssue/>
            </TechDocsAddons>
        </Route>
        <Route path="/create" element={<ScaffolderPage/>}/>
        <Route path="/api-docs" element={<ApiExplorerPage/>}/>
        <Route
            path="/catalog-import"
            element={
                <RequirePermission permission={catalogEntityCreatePermission}>
                    <CatalogImportPage/>
                </RequirePermission>
            }
        />
        <Route path="/search" element={<SearchPage/>}>
            {searchPage}
        </Route>
        <Route path="/settings" element={<UserSettingsPage/>}/>
        <Route path="/catalog-graph" element={<CatalogGraphPage/>}/>
        {username ? <Route path="/my-repos" element={MyReposPage()}/> : null}
    </FlatRoutes>
);

export default app.createRoot(
    <>
        <AlertDisplay/>
        <OAuthRequestDialog/>
        <AppRouter>
            <Root>{routes}</Root>
            <FestiveFun
                festivity="fall"
            />
        </AppRouter>
    </>
);