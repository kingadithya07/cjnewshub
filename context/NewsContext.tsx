

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, EPaperPage, Clipping, User, UserRole, Advertisement, WatermarkSettings, RecoveryRequest, ProfileUpdateRequest, EmailSettings, SubscriptionSettings } from '../types';
import { INITIAL_ARTICLES, INITIAL_EPAPER_PAGES, INITIAL_USERS, INITIAL_ADS, CHIEF_EDITOR_ID, MASTER_RECOVERY_KEY, DEFAULT_EMAIL_SETTINGS, DEFAULT_SUBSCRIPTION_SETTINGS } from '../constants';

interface NewsContextType {
  articles: Article[];
  ePaperPages: EPaperPage[];
  clippings: Clipping[];
  currentUser: User | null;
  users: User[];
  advertisements: Advertisement[];
  watermarkSettings: WatermarkSettings;
  recoveryRequests: RecoveryRequest[];
  emailSettings: EmailSettings;
  subscriptionSettings: SubscriptionSettings;
  login: (email: string, password: string, role?: UserRole) => User | null;
  register: (name: string, email: string, password: string, role?: UserRole) => boolean;
  createAdmin: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  resetPassword: (identifier: string, newPassword: string) => boolean; // Admin manual reset
  initiateRecovery: (identifier: string) => { code: string, message: string } | null; // Returns formatted email message
  completeRecovery: (identifier: string, code: string, newPassword: string) => boolean; // Verifies and resets
  
  // New Profile Security Functions
  initiateProfileUpdate: (newEmail?: string, newPassword?: string) => { code: string, message: string } | null;
  completeProfileUpdate: (code: string) => boolean;
  
  // Settings
  updateEmailSettings: (settings: EmailSettings) => void;
  updateSubscriptionSettings: (settings: SubscriptionSettings) => void;

  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  incrementArticleView: (id: string) => void;
  addEPaperPage: (page: EPaperPage) => void;
  deleteEPaperPage: (id: string) => void;
  addClipping: (clipping: Clipping) => void;
  deleteClipping: (id: string) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  addAdvertisement: (ad: Advertisement) => void;
  updateAdvertisement: (ad: Advertisement) => void;
  deleteAdvertisement: (id: string) => void;
  toggleAdStatus: (id: string) => void;
  trackAdClick: (id: string) => void;
  updateWatermarkSettings: (settings: WatermarkSettings) => void;
  approveContent: (type: 'article' | 'ad' | 'epaper', id: string) => void;
  rejectContent: (type: 'article' | 'ad' | 'epaper', id: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [ePaperPages, setEPaperPages] = useState<EPaperPage[]>(INITIAL_EPAPER_PAGES);
  const [clippings, setClippings] = useState<Clipping[]>([]);
  
  // Auth State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Recovery & Profile Update State
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([]);
  const [profileUpdateRequests, setProfileUpdateRequests] = useState<ProfileUpdateRequest[]>([]);

  // Ad State
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(INITIAL_ADS);

  // Visitor Identity (Simulate IP)
  const [visitorIp, setVisitorIp] = useState<string>('');

  // Watermark Settings State
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    text: 'CJ NEWS HUB',
    logoUrl: null
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(DEFAULT_EMAIL_SETTINGS);

  // Subscription Settings State
  const [subscriptionSettings, setSubscriptionSettings] = useState<SubscriptionSettings>(DEFAULT_SUBSCRIPTION_SETTINGS);

  // Load persistence
  useEffect(() => {
    const storedClippings = localStorage.getItem('cj_clippings');
    if (storedClippings) setClippings(JSON.parse(storedClippings));

    const storedUsers = localStorage.getItem('cj_users');
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedEPaper = localStorage.getItem('cj_epaper_pages');
    if (storedEPaper) {
         const parsedPages = JSON.parse(storedEPaper);
         const migratedPages = parsedPages.map((p: any) => ({
             ...p,
             status: p.status || 'active'
         }));
         setEPaperPages(migratedPages);
    }
    
    const storedAds = localStorage.getItem('cj_ads');
    if (storedAds) {
        const parsedAds = JSON.parse(storedAds);
        const migratedAds = parsedAds.map((ad: any) => ({
            ...ad,
            clicks: ad.clicks || 0,
            clickedIps: ad.clickedIps || [],
            status: (ad.status === 'active' || ad.status === 'inactive') ? ad.status : 'active'
        }));
        setAdvertisements(migratedAds);
    }

    const storedArticles = localStorage.getItem('cj_articles');
    if (storedArticles) {
        setArticles(JSON.parse(storedArticles));
    }

    const storedWatermark = localStorage.getItem('cj_watermark');
    if (storedWatermark) setWatermarkSettings(JSON.parse(storedWatermark));

    const storedSession = localStorage.getItem('cj_current_user');
    if (storedSession) setCurrentUser(JSON.parse(storedSession));
    
    const storedRecovery = localStorage.getItem('cj_recovery_requests');
    if (storedRecovery) setRecoveryRequests(JSON.parse(storedRecovery));

    const storedEmailSettings = localStorage.getItem('cj_email_settings');
    if (storedEmailSettings) setEmailSettings(JSON.parse(storedEmailSettings));

    const storedSubSettings = localStorage.getItem('cj_sub_settings');
    if (storedSubSettings) setSubscriptionSettings(JSON.parse(storedSubSettings));

    // Get or Create Visitor IP
    let ip = localStorage.getItem('cj_visitor_ip');
    if (!ip) {
       ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
       localStorage.setItem('cj_visitor_ip', ip);
    }
    setVisitorIp(ip);
  }, []);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('cj_clippings', JSON.stringify(clippings));
  }, [clippings]);

  useEffect(() => {
    localStorage.setItem('cj_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('cj_epaper_pages', JSON.stringify(ePaperPages));
  }, [ePaperPages]);

  useEffect(() => {
    localStorage.setItem('cj_ads', JSON.stringify(advertisements));
  }, [advertisements]);
  
  useEffect(() => {
    localStorage.setItem('cj_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('cj_watermark', JSON.stringify(watermarkSettings));
  }, [watermarkSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cj_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('cj_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cj_recovery_requests', JSON.stringify(recoveryRequests));
  }, [recoveryRequests]);

  useEffect(() => {
    localStorage.setItem('cj_email_settings', JSON.stringify(emailSettings));
  }, [emailSettings]);

  useEffect(() => {
    localStorage.setItem('cj_sub_settings', JSON.stringify(subscriptionSettings));
  }, [subscriptionSettings]);

  const login = (email: string, password: string, role?: UserRole): User | null => {
    const user = users.find(u => 
      u.email === email && 
      u.password === password && 
      (!role || u.role === role)
    );

    if (user) {
      if (user.status === 'blocked' || user.status === 'pending') {
        return null;
      }
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const register = (name: string, email: string, password: string, role: UserRole = 'publisher'): boolean => {
    if (users.find(u => u.email === email)) return false; 

    const userIp = visitorIp || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const now = new Date();
    const joinedAt = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    // Publishers are pending by default (require admin approval)
    // Subscribers and Admins (created by Chief) are active immediately
    const initialStatus = role === 'publisher' ? 'pending' : 'active';

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: role, 
      status: initialStatus,
      ip: userIp,
      joinedAt: joinedAt,
      subscriptionPlan: role === 'subscriber' ? 'free' : undefined
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // Auto login only if status is active
    if (initialStatus === 'active' && !currentUser) {
        setCurrentUser(newUser);
    }
    return true;
  };

  const createAdmin = (name: string, email: string, password: string): boolean => {
      // Security: Only Chief Editor can create new admins
      if (currentUser?.id !== CHIEF_EDITOR_ID) return false;
      if (users.find(u => u.email === email)) return false;

      const userIp = visitorIp || `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const now = new Date();
      const joinedAt = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

      const newAdmin: User = {
          id: Date.now().toString(),
          name,
          email,
          password,
          role: 'admin',
          status: 'active',
          ip: userIp,
          joinedAt: joinedAt
      };

      setUsers(prev => [...prev, newAdmin]);
      return true;
  };

  // Direct manual reset (Admin Only or Legacy)
  const resetPassword = (identifier: string, newPassword: string): boolean => {
    const userIndex = users.findIndex(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        u.name.toLowerCase() === identifier.toLowerCase()
    );

    if (userIndex === -1) return false;

    const updatedUsers = [...users];
    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
    setUsers(updatedUsers);
    return true;
  };

  const generateEmailMessage = (name: string, code: string) => {
      return emailSettings.emailTemplate
        .replace(/{name}/g, name)
        .replace(/{code}/g, code)
        .replace(/{companyName}/g, emailSettings.companyName);
  };

  // Automated Recovery: Step 1 - Generate Code & Email Content
  const initiateRecovery = (identifier: string): { code: string, message: string } | null => {
      const user = users.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        u.name.toLowerCase() === identifier.toLowerCase()
      );

      if (!user) return null;

      // Remove any existing request for this user
      setRecoveryRequests(prev => prev.filter(req => req.email !== user.email));

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      const newRequest: RecoveryRequest = {
          email: user.email,
          userName: user.name,
          code: code,
          timestamp: Date.now()
      };

      setRecoveryRequests(prev => [...prev, newRequest]);
      
      const message = generateEmailMessage(user.name, code);
      return { code, message };
  };

  // Automated Recovery: Step 2 - Verify Code & Reset
  const completeRecovery = (identifier: string, code: string, newPassword: string): boolean => {
      const user = users.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        u.name.toLowerCase() === identifier.toLowerCase()
      );

      if (!user) return false;

      // Special Check for Chief Editor Master Key
      if (user.id === CHIEF_EDITOR_ID && code === MASTER_RECOVERY_KEY) {
          const updatedUsers = users.map(u => 
            u.id === user.id ? { ...u, password: newPassword } : u
          );
          setUsers(updatedUsers);
          return true;
      }

      // Standard Verification Code Check
      const request = recoveryRequests.find(req => req.email === user.email && req.code === code);
      
      if (!request) return false;

      // Update password
      const updatedUsers = users.map(u => 
        u.email === user.email ? { ...u, password: newPassword } : u
      );
      setUsers(updatedUsers);

      // Remove request
      setRecoveryRequests(prev => prev.filter(req => req !== request));
      return true;
  };

  // --- SECURE PROFILE UPDATE (Authenticated) ---
  const initiateProfileUpdate = (newEmail?: string, newPassword?: string): { code: string, message: string } | null => {
      if (!currentUser) return null;

      // Remove existing pending updates
      setProfileUpdateRequests(prev => prev.filter(req => req.userId !== currentUser.id));

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const request: ProfileUpdateRequest = {
          userId: currentUser.id,
          newEmail,
          newPassword,
          verificationCode: code,
          timestamp: Date.now()
      };

      setProfileUpdateRequests(prev => [...prev, request]);
      
      const message = generateEmailMessage(currentUser.name, code);
      return { code, message };
  };

  const completeProfileUpdate = (code: string): boolean => {
      if (!currentUser) return false;

      const request = profileUpdateRequests.find(req => req.userId === currentUser.id && req.verificationCode === code);
      
      if (!request) return false;

      // Apply updates
      const updatedUsers = users.map(u => {
          if (u.id === currentUser.id) {
              return {
                  ...u,
                  email: request.newEmail || u.email,
                  password: request.newPassword || u.password
              };
          }
          return u;
      });

      setUsers(updatedUsers);
      
      // Update current session
      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id) || null;
      setCurrentUser(updatedCurrentUser);

      // Clear Request
      setProfileUpdateRequests(prev => prev.filter(req => req !== request));
      return true;
  };

  const updateEmailSettings = (settings: EmailSettings) => {
      setEmailSettings(settings);
  };

  const updateSubscriptionSettings = (settings: SubscriptionSettings) => {
      setSubscriptionSettings(settings);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- CONTENT CRUD WITH APPROVAL LOGIC ---

  const addArticle = (article: Article) => {
    // Admins and Publishers can publish directly. Only subscribers (if allowed to post?) or restricted roles would be pending.
    const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'publisher';
    const status = canPublish ? article.status : 'pending';
    setArticles(prev => [{...article, status}, ...prev]);
  };

  const updateArticle = (updatedArticle: Article) => {
    const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'publisher';
    const status = canPublish ? updatedArticle.status : 'pending';
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? {...updatedArticle, status} : a));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const incrementArticleView = (id: string) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, views: (a.views || 0) + 1 } : a
    ));
  };

  const addEPaperPage = (page: EPaperPage) => {
    const status = currentUser?.id === CHIEF_EDITOR_ID ? 'active' : 'pending';
    setEPaperPages(prev => [...prev, {...page, status}]);
  };

  const deleteEPaperPage = (id: string) => {
    setEPaperPages(prev => prev.filter(p => p.id !== id));
  };

  const addClipping = (clipping: Clipping) => {
    // If logged in, associate with user
    const finalClipping = { ...clipping, userId: currentUser?.id };
    setClippings(prev => [finalClipping, ...prev]);
  };

  const deleteClipping = (id: string) => {
    setClippings(prev => prev.filter(c => c.id !== id));
  };

  const deleteUser = (id: string) => {
    if (id === CHIEF_EDITOR_ID) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    if (id === CHIEF_EDITOR_ID) return;
    setUsers(prev => prev.map(u => {
        if (u.id === id) {
            // If it's active, block it. If it's blocked OR pending, activate it.
            return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
        }
        return u;
    }));
  };

  const addAdvertisement = (ad: Advertisement) => {
      const status = currentUser?.id === CHIEF_EDITOR_ID ? ad.status : 'pending';
      setAdvertisements(prev => [...prev, {...ad, status}]);
  };

  const updateAdvertisement = (updatedAd: Advertisement) => {
      const status = currentUser?.id === CHIEF_EDITOR_ID ? updatedAd.status : 'pending';
      setAdvertisements(prev => prev.map(a => a.id === updatedAd.id ? {...updatedAd, status} : a));
  };

  const deleteAdvertisement = (id: string) => {
      setAdvertisements(prev => prev.filter(a => a.id !== id));
  };

  const toggleAdStatus = (id: string) => {
      setAdvertisements(prev => prev.map(a => 
          a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
      ));
  };

  const trackAdClick = (id: string) => {
      setAdvertisements(prev => prev.map(ad => {
          if (ad.id === id) {
              const currentIps = ad.clickedIps || [];
              if (currentIps.includes(visitorIp)) {
                  return ad;
              }
              return {
                  ...ad,
                  clickedIps: [...currentIps, visitorIp],
                  clicks: (ad.clicks || 0) + 1
              };
          }
          return ad;
      }));
  };

  const updateWatermarkSettings = (settings: WatermarkSettings) => {
      setWatermarkSettings(settings);
  };

  const approveContent = (type: 'article' | 'ad' | 'epaper', id: string) => {
      if (currentUser?.id !== CHIEF_EDITOR_ID) return;

      if (type === 'article') {
          setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a));
      } else if (type === 'ad') {
          setAdvertisements(prev => prev.map(a => a.id === id ? { ...a, status: 'active' } : a));
      } else if (type === 'epaper') {
          setEPaperPages(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
      }
  };

  const rejectContent = (type: 'article' | 'ad' | 'epaper', id: string) => {
      if (currentUser?.id !== CHIEF_EDITOR_ID) return;
      
      if (type === 'article') {
          setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'draft' } : a));
      } else if (type === 'ad') {
           setAdvertisements(prev => prev.map(a => a.id === id ? { ...a, status: 'inactive' } : a));
      } else if (type === 'epaper') {
           setEPaperPages(prev => prev.filter(p => p.id !== id));
      }
  };

  return (
    <NewsContext.Provider value={{
      articles,
      ePaperPages,
      clippings,
      currentUser,
      users,
      advertisements,
      watermarkSettings,
      recoveryRequests,
      emailSettings,
      subscriptionSettings,
      login,
      register,
      createAdmin,
      logout,
      resetPassword,
      initiateRecovery,
      completeRecovery,
      initiateProfileUpdate,
      completeProfileUpdate,
      updateEmailSettings,
      updateSubscriptionSettings,
      addArticle,
      updateArticle,
      deleteArticle,
      incrementArticleView,
      addEPaperPage,
      deleteEPaperPage,
      addClipping,
      deleteClipping,
      deleteUser,
      toggleUserStatus,
      addAdvertisement,
      updateAdvertisement,
      deleteAdvertisement,
      toggleAdStatus,
      trackAdClick,
      updateWatermarkSettings,
      approveContent,
      rejectContent
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
