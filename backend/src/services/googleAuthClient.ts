import { OAuth2Client } from 'google-auth-library';

let oauthClient: OAuth2Client | null = null;

function createOAuthClient() {
  return new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
}

export const googleAuthClient = {
  getInstance: () => {
    if (!oauthClient) {
      oauthClient = createOAuthClient();
    }
    return oauthClient;
  },
};
