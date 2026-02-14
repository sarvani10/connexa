import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_SCOPES, GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_USER_INFO_URL } from '../config/googleAuth';

export class GoogleAuthService {
  private static instance: GoogleAuthService;

  private constructor() {}

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public async initiateGoogleSignIn(): Promise<{ code?: string; error?: string }> {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const authUrl = `${GOOGLE_AUTH_URL}?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${GOOGLE_SCOPES.join(' ')}&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Open Google OAuth in popup
    const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
    
    return new Promise<{ code?: string; error?: string }>((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Google sign-in was cancelled'));
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.origin === window.location.origin) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          popup?.close();
          
          if (event.data.type === 'google-auth-success') {
            resolve({ code: event.data.code });
          } else if (event.data.type === 'google-auth-error') {
            reject(new Error(event.data.error));
          }
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  public async exchangeCodeForTokens(code: string): Promise<any> {
    try {
      const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: window.location.origin,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      return await response.json();
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  public async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${GOOGLE_USER_INFO_URL}?access_token=${accessToken}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  public async signInWithGoogle(): Promise<any> {
    try {
      // Check if we have an authorization code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        // Exchange authorization code for tokens
        const tokens = await this.exchangeCodeForTokens(code);
        
        // Get user info
        const userInfo = await this.getUserInfo(tokens.access_token);
        
        return {
          id: userInfo.id,
          email: userInfo.email,
          fullName: userInfo.name,
          username: userInfo.email.split('@')[0],
          bio: `Google user - ${userInfo.email}`,
          isPrivate: false,
          postsCount: 0,
          connectionsCount: 0,
          createdAt: new Date(),
        };
      }
      
      // If no code, initiate OAuth flow
      const authResult = await this.initiateGoogleSignIn();
      
      if (authResult.code) {
        // Exchange authorization code for tokens
        const tokens = await this.exchangeCodeForTokens(authResult.code);
        
        // Get user info
        const userInfo = await this.getUserInfo(tokens.access_token);
        
        return {
          id: userInfo.id,
          email: userInfo.email,
          fullName: userInfo.name,
          username: userInfo.email.split('@')[0],
          bio: `Google user - ${userInfo.email}`,
          isPrivate: false,
          postsCount: 0,
          connectionsCount: 0,
          createdAt: new Date(),
        };
      }
      
      throw new Error('Google sign-in failed');
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }
}
