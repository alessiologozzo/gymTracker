import { AuthConfig } from 'angular-oauth2-oidc';

  export const authCodeFlowConfig: AuthConfig = {
    // Url of the Identity Provider
    issuer: 'http://localhost:7080/realms/gymTracker',
    // issuer: 'http://localhost:8080',

    // URL of the SPA to redirect the user to after login
    redirectUri: 'http://localhost:4200',

    postLogoutRedirectUri: 'http://localhost:4200',

    // The SPA's id. The SPA is registerd with this id at the auth-server
    // clientId: 'server.code',
    clientId: 'gym-tracker-spa',

    // Just needed if your auth server demands a secret. In general, this
    // is a sign that the auth server is not configured with SPAs in mind
    // and it might not enforce further best practices vital for security
    // such applications.
    // dummyClientSecret: 'rOFVqtVddwUyvW5SbptiMcGEVA73jvl0',

    responseType: 'code',

    // set the scope for the permissions the client should request
    // The first four are defined by OIDC.
    // Important: Request offline_access to get a refresh token
    // The api scope is a usecase specific one
    scope: 'openid',

    strictDiscoveryDocumentValidation: true,

    // showDebugInformation: true,

    tokenEndpoint: "http://localhost:7080/realms/gymTracker/protocol/openid-connect/token"
  };