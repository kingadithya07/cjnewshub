import React, { useState, useEffect } from 'react';
import { useNews } from '../context/NewsContext';
import { Article, EPaperPage, User, Advertisement, AdSize } from '../types';
import { Trash2, Upload, FileText, Image as ImageIcon, Sparkles, Video, Save, Edit, CheckCircle, Calendar, XCircle, Users, Ban, Power, Megaphone, Globe, Layout, ExternalLink, Clock, RefreshCw, Eye, MousePointerClick, Type, X, Shield, ShieldAlert, Check, Key, Settings, Lock, Mail, Send, DollarSign, CreditCard, Film } from 'lucide-react';
import { CATEGORIES, CHIEF_EDITOR_ID } from '../constants';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { 
      articles, ePaperPages, addArticle, updateArticle, deleteArticle, 
      addEPaperPage, deleteEPaperPage, currentUser, users, deleteUser, toggleUserStatus, createAdmin,
      advertisements, addAdvertisement, updateAdvertisement, deleteAdvertisement, toggleAdStatus,
      watermarkSettings, updateWatermarkSettings, approveContent, rejectContent, recoveryRequests,
      initiateProfileUpdate, completeProfileUpdate, emailSettings, updateEmailSettings,
      subscriptionSettings, updateSubscriptionSettings
    } = useNews();
  const [activeTab, setActiveTab] = useState<'articles' | 'epaper' | 'publishers' | 'subscribers' | 'ads' | 'admins' | 'approvals' | 'settings'>('articles');
  
  // Checks
  const isChiefEditor = currentUser?.id === CHIEF_EDITOR_ID;
  const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'publisher';

  // Article Form State
  const initialFormState: Partial<Article> = {
    category: CATEGORIES[0],
    tags: [],
    status: 'draft',
    isFeatured: false,
    title: '',
    excerpt: '',
    content: '',
    author: '',
    imageUrl: '',
    videoUrl: '',
    views: 0
  };

  const [articleForm, setArticleForm] = useState<Partial<Article>>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imageSourceType, setImageSourceType] = useState<'url' | 'upload'>('url');
  const [videoSourceType, setVideoSourceType] = useState<'url' | 'upload'>('url');

  // EPaper Form State
  const [ePaperUrl, setEPaperUrl] = useState('');
  const [ePaperDate, setEPaperDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Watermark Form State
  const [watermarkFormText, setWatermarkFormText] = useState(watermarkSettings.text);
  const [watermarkFormLogo, setWatermarkFormLogo] = useState<string | null>(watermarkSettings.logoUrl);

  // Email Settings Form State
  const [emailApiKey, setEmailApiKey] = useState(emailSettings.apiKey);
  const [emailSender, setEmailSender] = useState(emailSettings.senderEmail);
  const [emailCompany, setEmailCompany] = useState(emailSettings.companyName);
  const [emailTemplate, setEmailTemplate] = useState(emailSettings.emailTemplate);

  // Subscription Settings Form State
  const [subShowPayment, setSubShowPayment] = useState(subscriptionSettings.showPaymentButton);
  const [subPaymentLink, setSubPaymentLink] = useState(subscriptionSettings.paymentLink);
  const [subPrice, setSubPrice] = useState(subscriptionSettings.monthlyPrice);

  // Admin Create Form
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Settings / Profile Update State
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [isProfileVerifying, setIsProfileVerifying] = useState(false);
  const [profileVerificationCode, setProfileVerificationCode] = useState('');

  // Load current user info into settings form
  useEffect(() => {
    if (currentUser) {
        setSettingsEmail(currentUser.email);
    }
  }, [currentUser]);

  // Update local forms when global settings change
  useEffect(() => {
      setWatermarkFormText(watermarkSettings.text);
      setWatermarkFormLogo(watermarkSettings.logoUrl);
      setEmailApiKey(emailSettings.apiKey);
      setEmailSender(emailSettings.senderEmail);
      setEmailCompany(emailSettings.companyName);
      setEmailTemplate(emailSettings.emailTemplate);
      setSubShowPayment(subscriptionSettings.showPaymentButton);
      setSubPaymentLink(subscriptionSettings.paymentLink);
      setSubPrice(subscriptionSettings.monthlyPrice);
  }, [watermarkSettings, emailSettings, subscriptionSettings]);

  // Ad Form State
  const getToday = () => new Date().toISOString().split('T')[0];
  const getFutureDate = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
  };

  const initialAdFormState: Partial<Advertisement> = {
      advertiserName: '',
      imageUrl: '',
      targetUrl: '',
      size: AdSize.RECTANGLE,
      status: 'active',
      startDate: getToday(),
      endDate: getFutureDate(30),
      clicks: 0,
      clickedIps: []
  };
  const [adForm, setAdForm] = useState<Partial<Advertisement>>(initialAdFormState);
  const [adImageSourceType, setAdImageSourceType] = useState<'url' | 'upload'>('url');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  if (!currentUser) {
      return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-3xl font-serif font-bold text-ink mb-4">Access Restricted</h2>
              <p className="text-gray-600 mb-8 max-w-md">You must be logged in to access the dashboard.</p>
              <div className="flex gap-4">
                 <Link to="/login" className="bg-ink text-white px-8 py-3 text-xs font-bold tracking-widest hover:bg-gold hover:text-ink transition-colors">
                    LOGIN TO DASHBOARD
                 </Link>
              </div>
          </div>
      );
  }

  // Helper to format ISO YYYY-MM-DD to DD-MM-YYYY for display
  const formatDisplayDate = (ymd: string) => {
    if (!ymd) return '';
    const parts = ymd.split('-');
    if (parts.length !== 3) return ymd;
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  };

  // --- FILTER ARTICLES BY ROLE ---
  const visibleArticles = articles.filter(article => {
      if (isChiefEditor) return true;
      if (currentUser.role === 'admin') return true;
      return article.authorId === currentUser.id;
  });

  const pendingArticles = articles.filter(a => a.status === 'pending');
  const pendingAds = advertisements.filter(a => a.status === 'pending');
  const pendingEPaper = ePaperPages.filter(p => p.status === 'pending');
  const totalPending = pendingArticles.length + pendingAds.length + pendingEPaper.length;

  // --- FILTER USERS ---
  const publisherUsers = users.filter(u => u.role === 'publisher');
  const adminUsers = users.filter(u => u.role === 'admin' && u.id !== CHIEF_EDITOR_ID);
  const subscriberUsers = users.filter(u => u.role === 'subscriber');

  // --- FORM HANDLERS ---
  const handleEditClick = (article: Article) => {
      setEditingId(article.id);
      setArticleForm(article);
      setTagsInput(article.tags.join(', '));
      setMediaType(article.videoUrl ? 'video' : 'image');
      if (article.imageUrl && article.imageUrl.startsWith('data:')) {
          setImageSourceType('upload');
      } else {
          setImageSourceType('url');
      }
      setActiveTab('articles');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setArticleForm(initialFormState);
      setTagsInput('');
      setImageSourceType('url');
      setVideoSourceType('url');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 2 * 1024 * 1024) { 
              alert("File size exceeds 2MB limit.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              // Simulating storing to 'public/uploads/images'
              setArticleForm(prev => ({ ...prev, imageUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 15 * 1024 * 1024) { 
              alert("Video size exceeds 15MB limit for this demo.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              // Simulating storing to 'public/uploads/videos'
              setArticleForm(prev => ({ ...prev, videoUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!articleForm.title || !articleForm.excerpt) return;

      const finalTags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const now = new Date();
      const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

      // Ensure we have an image even if video is selected (thumbnail)
      const finalImage = articleForm.imageUrl || (articleForm.videoUrl ? `https://picsum.photos/800/600?random=${Date.now()}` : `https://picsum.photos/800/600?random=${Date.now()}`);

      const articleData: Article = {
          id: editingId || Date.now().toString(),
          title: articleForm.title,
          excerpt: articleForm.excerpt,
          content: articleForm.content || '',
          author: articleForm.author || currentUser.name,
          authorId: articleForm.authorId || currentUser.id,
          category: articleForm.category || 'World',
          date: editingId ? (articleForm.date || todayStr) : todayStr,
          imageUrl: finalImage,
          videoUrl: articleForm.videoUrl,
          tags: finalTags,
          status: articleForm.status || 'draft',
          isFeatured: articleForm.isFeatured || false,
          views: editingId ? (articleForm.views || 0) : 0
      };

      if (editingId) {
          updateArticle(articleData);
          alert(canPublish ? 'Article updated successfully!' : 'Article update submitted for approval.');
      } else {
          addArticle(articleData);
          alert(canPublish ? 'Article published successfully!' : 'Article submitted for approval.');
      }
      handleCancelEdit();
  };

  const handleEPaperSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(!ePaperUrl) return;
      const pagesForDate = ePaperPages.filter(p => p.date === ePaperDate);
      const newPage: EPaperPage = {
          id: Date.now().toString(),
          pageNumber: pagesForDate.length + 1,
          date: ePaperDate,
          imageUrl: ePaperUrl,
          status: 'active'
      };
      addEPaperPage(newPage);
      setEPaperUrl('');
      alert(isChiefEditor ? `Page added for ${formatDisplayDate(ePaperDate)}!` : 'Page submitted for approval.');
  };

  const handleWatermarkSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isChiefEditor) return;
      updateWatermarkSettings({
          text: watermarkFormText,
          logoUrl: watermarkFormLogo
      });
      alert('Watermark settings updated!');
  };

  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateEmailSettings({
          apiKey: emailApiKey,
          senderEmail: emailSender,
          companyName: emailCompany,
          emailTemplate: emailTemplate
      });
      alert("Email configuration updated successfully.");
  };

  const handleSubscriptionSettingsSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateSubscriptionSettings({
          showPaymentButton: subShowPayment,
          paymentLink: subPaymentLink,
          monthlyPrice: subPrice
      });
      alert("Subscription payment settings updated.");
  };

  const handleWatermarkLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setWatermarkFormLogo(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isChiefEditor) return;
      if (createAdmin(newAdminName, newAdminEmail, newAdminPassword)) {
          alert(`Admin ${newAdminName} created successfully.`);
          setNewAdminName('');
          setNewAdminEmail('');
          setNewAdminPassword('');
      } else {
          alert('Failed to create admin. Email might already be in use.');
      }
  };

  const handleInitiateProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      const result = initiateProfileUpdate(settingsEmail, settingsPassword);
      if (result) {
          setIsProfileVerifying(true);
          alert(`(SIMULATION EMAIL sent to ${currentUser.email})\n\n${result.message}`);
      } else {
          alert("Failed to initiate update.");
      }
  };

  const handleCompleteProfileUpdate = (e: React.FormEvent) => {
      e.preventDefault();
      const success = completeProfileUpdate(profileVerificationCode);
      if (success) {
          alert("Profile updated successfully!");
          setIsProfileVerifying(false);
          setProfileVerificationCode('');
          setSettingsPassword('');
      } else {
          alert("Invalid verification code. Please try again.");
      }
  };

  const handleAdSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!adForm.advertiserName || !adForm.imageUrl || !adForm.targetUrl) {
          alert("Please fill in all ad details.");
          return;
      }

      if (editingAdId) {
          const updatedAd: Advertisement = {
              id: editingAdId,
              advertiserName: adForm.advertiserName!,
              imageUrl: adForm.imageUrl!,
              targetUrl: adForm.targetUrl!,
              size: adForm.size || AdSize.RECTANGLE,
              status: adForm.status || 'active',
              startDate: adForm.startDate || getToday(),
              endDate: adForm.endDate || getFutureDate(30),
              clicks: adForm.clicks || 0,
              clickedIps: adForm.clickedIps || []
          };
          updateAdvertisement(updatedAd);
          alert(isChiefEditor ? "Advertisement updated successfully!" : "Advertisement update submitted for approval.");
      } else {
          const newAd: Advertisement = {
              id: Date.now().toString(),
              advertiserName: adForm.advertiserName!,
              imageUrl: adForm.imageUrl!,
              targetUrl: adForm.targetUrl!,
              size: adForm.size || AdSize.RECTANGLE,
              status: adForm.status || 'active',
              startDate: adForm.startDate || getToday(),
              endDate: adForm.endDate || getFutureDate(30),
              clicks: 0,
              clickedIps: []
          };
          addAdvertisement(newAd);
          alert(isChiefEditor ? "Advertisement posted successfully!" : "Advertisement submitted for approval.");
      }
      handleCancelAdEdit();
  };

  const handleCancelAdEdit = () => {
      setEditingAdId(null);
      setAdForm(initialAdFormState);
      setAdImageSourceType('url');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setEPaperUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const groupedPages = ePaperPages.filter(p => isChiefEditor ? true : p.status === 'active').reduce((acc, page) => {
      if (!acc[page.date]) acc[page.date] = [];
      acc[page.date].push(page);
      return acc;
  }, {} as Record<string, EPaperPage[]>);
  const sortedDates = Object.keys(groupedPages).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 gap-4 md:gap-0">
          <div>
            <h1 className="text-4xl font-serif font-bold text-ink">CMS Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
                Welcome back, <span className="font-bold text-gold-dark">{currentUser.name}</span> 
                {isChiefEditor && <span className="ml-2 bg-ink text-gold px-2 py-0.5 text-[10px] rounded uppercase">Chief Editor</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4">
              <button onClick={() => setActiveTab('articles')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'articles' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Articles</button>
              {currentUser.role === 'admin' && (
                <>
                    <button onClick={() => setActiveTab('epaper')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'epaper' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>E-Paper</button>
                    <button onClick={() => setActiveTab('publishers')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'publishers' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Publishers</button>
                    <button onClick={() => setActiveTab('subscribers')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'subscribers' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Subscribers</button>
                    <button onClick={() => setActiveTab('ads')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'ads' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Ads</button>
                    {isChiefEditor && (
                        <>
                            <button onClick={() => setActiveTab('admins')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm ${activeTab === 'admins' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Admins</button>
                             <button onClick={() => setActiveTab('approvals')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm flex items-center gap-2 ${activeTab === 'approvals' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}>Approvals {totalPending > 0 && <span className="bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">{totalPending}</span>}</button>
                        </>
                    )}
                </>
              )}
               <button onClick={() => setActiveTab('settings')} className={`px-4 md:px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all rounded-sm flex items-center gap-2 ${activeTab === 'settings' ? 'bg-ink text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200'}`}><Settings size={14}/> Settings</button>
          </div>
      </div>

      {/* --- SUBSCRIBERS TAB --- */}
      {activeTab === 'subscribers' && currentUser.role === 'admin' && (
          <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-xl text-gray-700 flex items-center gap-2">
                    <Users className="text-gold-dark"/> Subscriber Base
                </h3>
              </div>
               <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold uppercase text-gray-600 tracking-wider">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {subscriberUsers.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic">No subscribers yet.</td></tr>
                        ) : (
                            subscriberUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-ink text-sm">{user.name}</td>
                                    <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="p-4 text-xs text-gray-500">{user.joinedAt || 'Unknown'}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => toggleUserStatus(user.id)} className={`p-2 rounded transition-colors ${user.status === 'active' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`} title="Block/Unblock"><Ban size={16} /></button>
                                        <button onClick={() => { if(window.confirm('Remove this subscriber?')) deleteUser(user.id); }} className="p-2 bg-red-100 text-red-600 rounded" title="Remove"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Profile Update Section */}
              <div className="bg-white p-8 shadow-sm border-t-4 border-gray-600">
                  <h3 className="font-serif font-bold text-xl mb-4 text-gray-700 flex items-center gap-2">
                       <Shield size={20}/> Profile & Security
                  </h3>
                  
                  {!isProfileVerifying ? (
                      <form onSubmit={handleInitiateProfileUpdate} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Update Email Address</label>
                              <input type="email" className="w-full border p-3 text-sm focus:ring-1 focus:ring-ink outline-none" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)}/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New Password</label>
                              <input type="password" placeholder="Leave blank to keep current" className="w-full border p-3 text-sm focus:ring-1 focus:ring-ink outline-none" value={settingsPassword} onChange={e => setSettingsPassword(e.target.value)}/>
                          </div>
                          <div className="pt-4">
                              <button type="submit" className="w-full bg-ink text-white py-3 font-bold hover:bg-gold hover:text-ink transition-colors uppercase tracking-widest text-xs">Request Update</button>
                          </div>
                      </form>
                  ) : (
                      <form onSubmit={handleCompleteProfileUpdate} className="space-y-6 bg-gray-50 p-6 rounded border border-gold animate-in fade-in">
                          <div className="text-center">
                              <h4 className="font-bold text-ink">Verify Identity</h4>
                              <p className="text-xs text-gray-500 mt-1">Enter code sent to {currentUser.email}</p>
                          </div>
                          <input type="text" required placeholder="Enter 6-digit code" className="w-full border-2 border-gold p-3 text-center text-lg font-bold tracking-widest focus:outline-none" value={profileVerificationCode} onChange={e => setProfileVerificationCode(e.target.value)}/>
                          <div className="flex gap-2">
                              <button type="button" onClick={() => { setIsProfileVerifying(false); setProfileVerificationCode(''); }} className="flex-1 bg-gray-200 text-gray-600 py-3 font-bold uppercase text-xs hover:bg-gray-300">Cancel</button>
                              <button type="submit" className="flex-1 bg-green-600 text-white py-3 font-bold uppercase text-xs hover:bg-green-700">Confirm Changes</button>
                          </div>
                      </form>
                  )}
              </div>

               <div className="flex flex-col gap-8">
                   {/* Read Only Info */}
                   <div className="bg-white p-8 shadow-sm border border-gray-200">
                       <h3 className="font-serif font-bold text-xl mb-4 text-gray-700">Account Status</h3>
                       <div className="space-y-4 text-sm">
                           <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Role</span><span className="font-bold uppercase">{currentUser.role}</span></div>
                           <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Member Since</span><span className="font-bold">{currentUser.joinedAt}</span></div>
                           <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">Status</span><span className="font-bold text-green-600 uppercase flex items-center gap-1"><CheckCircle size={14}/> {currentUser.status}</span></div>
                       </div>
                   </div>

                    {/* Email Configuration */}
                    {currentUser.role === 'admin' && (
                        <div className="bg-white p-8 shadow-sm border-l-4 border-l-blue-500">
                            <h3 className="font-serif font-bold text-xl mb-4 text-gray-700 flex items-center gap-2"><Mail size={20}/> Email Configuration</h3>
                            <form onSubmit={handleEmailSettingsSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Service API Key</label>
                                    <input type="password" required className="w-full border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" value={emailApiKey} onChange={e => setEmailApiKey(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sender Email ID</label>
                                    <input type="email" required className="w-full border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" value={emailSender} onChange={e => setEmailSender(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Company Name</label>
                                    <input type="text" required className="w-full border p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none" value={emailCompany} onChange={e => setEmailCompany(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Template</label>
                                    <textarea required rows={4} className="w-full border p-2 text-sm font-mono text-gray-600 focus:ring-1 focus:ring-blue-500 outline-none" value={emailTemplate} onChange={e => setEmailTemplate(e.target.value)}/>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 font-bold hover:bg-blue-700 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2"><Save size={14} /> Save Configuration</button>
                            </form>
                        </div>
                    )}

                    {/* Subscription Settings */}
                    {currentUser.role === 'admin' && (
                        <div className="bg-white p-8 shadow-sm border-l-4 border-l-gold">
                             <h3 className="font-serif font-bold text-xl mb-4 text-gray-700 flex items-center gap-2"><DollarSign size={20}/> Subscription Settings</h3>
                             <form onSubmit={handleSubscriptionSettingsSubmit} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-gray-600">Enable Payment Banner & Button</label>
                                    <input type="checkbox" checked={subShowPayment} onChange={e => setSubShowPayment(e.target.checked)} className="w-5 h-5 accent-gold cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Monthly Price Display</label>
                                    <input type="text" className="w-full border p-2 text-sm outline-none" value={subPrice} onChange={e => setSubPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Payment Link (PayPal/Stripe URL)</label>
                                    <input type="text" className="w-full border p-2 text-sm outline-none" value={subPaymentLink} onChange={e => setSubPaymentLink(e.target.value)} />
                                </div>
                                <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white py-2 font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2"><CreditCard size={14} /> Update Payment Settings</button>
                             </form>
                             <p className="text-[10px] text-gray-400 mt-2">
                                Note: Disabling the payment banner will hide the payment section on the Subscribe page, allowing for free-only registrations.
                             </p>
                        </div>
                    )}
               </div>
          </div>
      )}

      {/* --- APPROVALS TAB --- */}
      {activeTab === 'approvals' && isChiefEditor && (
          <div className="space-y-8">
               <h3 className="font-serif font-bold text-2xl text-ink flex items-center gap-2"><ShieldAlert className="text-gold" /> Pending Approvals</h3>
               {totalPending === 0 ? (<div className="bg-white p-12 text-center text-gray-500 border border-gray-200"><CheckCircle className="mx-auto w-12 h-12 text-green-500 mb-4" /><p className="text-lg">All caught up! No pending items.</p></div>) : (
                  <div className="grid grid-cols-1 gap-8">
                       {pendingArticles.length > 0 && (<div className="bg-white border border-gray-200 shadow-sm"><div className="bg-gray-100 px-4 py-2 font-bold uppercase text-xs tracking-wide">Articles ({pendingArticles.length})</div><div className="divide-y divide-gray-100">{pendingArticles.map(a => (<div key={a.id} className="p-4 flex justify-between items-center"><div><h4 className="font-bold">{a.title}</h4></div><div className="flex gap-2"><button onClick={() => approveContent('article', a.id)} className="text-green-600 font-bold text-xs uppercase">Approve</button><button onClick={() => rejectContent('article', a.id)} className="text-red-600 font-bold text-xs uppercase">Reject</button></div></div>))}</div></div>)}
                       {pendingAds.length > 0 && (<div className="bg-white border border-gray-200 shadow-sm"><div className="bg-gray-100 px-4 py-2 font-bold uppercase text-xs tracking-wide">Ads ({pendingAds.length})</div><div className="divide-y divide-gray-100">{pendingAds.map(a => (<div key={a.id} className="p-4 flex justify-between items-center"><div><h4 className="font-bold">{a.advertiserName}</h4></div><div className="flex gap-2"><button onClick={() => approveContent('ad', a.id)} className="text-green-600 font-bold text-xs uppercase">Approve</button><button onClick={() => rejectContent('ad', a.id)} className="text-red-600 font-bold text-xs uppercase">Reject</button></div></div>))}</div></div>)}
                       {pendingEPaper.length > 0 && (<div className="bg-white border border-gray-200 shadow-sm"><div className="bg-gray-100 px-4 py-2 font-bold uppercase text-xs tracking-wide">E-Paper ({pendingEPaper.length})</div><div className="divide-y divide-gray-100">{pendingEPaper.map(p => (<div key={p.id} className="p-4 flex justify-between items-center"><div><h4 className="font-bold">{p.date} - Page {p.pageNumber}</h4></div><div className="flex gap-2"><button onClick={() => approveContent('epaper', p.id)} className="text-green-600 font-bold text-xs uppercase">Approve</button><button onClick={() => rejectContent('epaper', p.id)} className="text-red-600 font-bold text-xs uppercase">Reject</button></div></div>))}</div></div>)}
                  </div>
               )}
          </div>
      )}
      
      {/* --- ADMINS TAB --- */}
      {activeTab === 'admins' && isChiefEditor && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                   <div className="bg-white p-6 shadow-sm border-t-4 border-ink">
                        <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2"><Shield size={20}/> Create New Admin</h3>
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <input type="text" required placeholder="Name" className="w-full border p-2 text-sm outline-none" value={newAdminName} onChange={e => setNewAdminName(e.target.value)}/>
                            <input type="email" required placeholder="Email" className="w-full border p-2 text-sm outline-none" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)}/>
                            <input type="password" required placeholder="Password" className="w-full border p-2 text-sm outline-none" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)}/>
                            <button type="submit" className="w-full bg-ink text-white py-3 font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest text-xs">Create Admin User</button>
                        </form>
                   </div>
              </div>
              <div className="lg:col-span-2">
                   <h3 className="font-serif font-bold text-xl mb-4 text-gray-700">Admin Team</h3>
                   <div className="bg-white shadow-sm border border-gray-200">
                       <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b border-gray-200 text-xs font-bold uppercase text-gray-600"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">{adminUsers.map(user => (<tr key={user.id}><td className="p-4 text-sm font-bold">{user.name}</td><td className="p-4 text-sm">{user.email}</td><td className="p-4"><span className="bg-green-100 text-green-800 text-[10px] px-2 py-1 rounded font-bold uppercase">{user.status}</span></td><td className="p-4 text-right"><button onClick={() => { if(window.confirm('Delete this admin?')) deleteUser(user.id) }} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button></td></tr>))}</tbody>
                       </table>
                   </div>
              </div>
          </div>
      )}

      {/* --- ARTICLES TAB --- */}
      {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                <form id="articleForm" onSubmit={handleArticleSubmit} className="bg-white p-8 shadow-sm border-t-4 border-gold">
                    <div className="flex justify-between items-center mb-6"><h3 className="font-serif font-bold text-2xl flex items-center gap-2">{editingId ? <Edit size={24} className="text-gold"/> : <FileText size={24} className="text-gold"/>} {editingId ? 'Edit Article' : 'New Article'}</h3>{editingId && (<button type="button" onClick={handleCancelEdit} className="text-xs text-red-500 underline font-bold uppercase">Cancel Edit</button>)}</div>
                    
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between items-end"><label className="text-xs font-bold uppercase text-gray-500">Headline</label></div>
                        <input type="text" required placeholder="Enter a gripping headline..." className="w-full border-b-2 border-gray-200 py-2 text-xl font-serif font-bold focus:border-gold focus:outline-none placeholder-gray-300" value={articleForm.title || ''} onChange={e => setArticleForm({...articleForm, title: e.target.value})}/>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Media Attachment</label>
                        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-2">
                            <button type="button" onClick={() => setMediaType('image')} className={`flex items-center gap-2 text-xs font-bold uppercase py-2 px-4 rounded ${mediaType === 'image' ? 'bg-gray-100 text-ink' : 'text-gray-400 hover:bg-gray-50'}`}><ImageIcon size={14}/> Image</button>
                            <button type="button" onClick={() => setMediaType('video')} className={`flex items-center gap-2 text-xs font-bold uppercase py-2 px-4 rounded ${mediaType === 'video' ? 'bg-gray-100 text-ink' : 'text-gray-400 hover:bg-gray-50'}`}><Video size={14}/> Video</button>
                        </div>
                        
                        {mediaType === 'image' ? (
                            <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex gap-6 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-ink"><input type="radio" name="imageSource" checked={imageSourceType === 'url'} onChange={() => setImageSourceType('url')} className="accent-gold w-4 h-4"/><span>External URL</span></label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-ink"><input type="radio" name="imageSource" checked={imageSourceType === 'upload'} onChange={() => setImageSourceType('upload')} className="accent-gold w-4 h-4"/><span>Upload to Server</span></label>
                                </div>
                                
                                {imageSourceType === 'url' ? (
                                    <input type="text" placeholder="Image URL (e.g., https://picsum.photos/...)" className="w-full bg-white border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-gold outline-none" value={articleForm.imageUrl || ''} onChange={e => setArticleForm({...articleForm, imageUrl: e.target.value})}/>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:bg-white relative group rounded transition-colors bg-white">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="text-gray-400 mb-2 group-hover:text-gold transition-colors" size={24} />
                                            <p className="text-xs text-gray-500 font-bold uppercase">Click to upload image</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Stored in /uploads/images (Max: 2MB)</p>
                                        </div>
                                    </div>
                                )}
                                
                                {articleForm.imageUrl && (
                                    <div className="mt-3 relative w-full h-48 bg-gray-200 rounded overflow-hidden border border-gray-200 group">
                                        <img src={articleForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                        <button type="button" onClick={() => setArticleForm({...articleForm, imageUrl: ''})} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Image"><Trash2 size={14} /></button>
                                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold">Image Preview</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex gap-6 text-xs font-bold text-gray-600 uppercase tracking-wide">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-ink"><input type="radio" name="videoSource" checked={videoSourceType === 'url'} onChange={() => setVideoSourceType('url')} className="accent-gold w-4 h-4"/><span>External Link</span></label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-ink"><input type="radio" name="videoSource" checked={videoSourceType === 'upload'} onChange={() => setVideoSourceType('upload')} className="accent-gold w-4 h-4"/><span>Upload Video</span></label>
                                </div>

                                {videoSourceType === 'url' ? (
                                    <input type="text" placeholder="Video URL (MP4 or Embed Link)" className="w-full bg-white border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-gold outline-none" value={articleForm.videoUrl || ''} onChange={e => setArticleForm({...articleForm, videoUrl: e.target.value})}/>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:bg-white relative group rounded transition-colors bg-white">
                                        <input type="file" accept="video/mp4,video/webm" onChange={handleVideoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        <div className="flex flex-col items-center justify-center">
                                            <Film className="text-gray-400 mb-2 group-hover:text-gold transition-colors" size={24} />
                                            <p className="text-xs text-gray-500 font-bold uppercase">Click to upload video</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Stored in /uploads/videos (Max: 15MB)</p>
                                        </div>
                                    </div>
                                )}
                                
                                {articleForm.videoUrl && (
                                     <div className="mt-3 relative w-full h-48 bg-black rounded overflow-hidden border border-gray-200 group flex items-center justify-center">
                                        <video src={articleForm.videoUrl} className="w-full h-full object-contain" controls />
                                        <button type="button" onClick={() => setArticleForm({...articleForm, videoUrl: ''})} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10" title="Remove Video"><Trash2 size={14} /></button>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-6 space-y-2"><div className="flex justify-between items-end"><label className="text-xs font-bold uppercase text-gray-500">Article Content</label></div><textarea required rows={12} placeholder="Write your story here..." className="w-full border border-gray-200 p-4 font-serif text-lg leading-relaxed focus:ring-1 focus:ring-gold outline-none" value={articleForm.content || ''} onChange={e => setArticleForm({...articleForm, content: e.target.value})}/></div>
                    <div className="mb-6 space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold uppercase text-gray-500">Excerpt / Summary</label>
                        </div>
                        <textarea required rows={3} placeholder="Short summary for the home page..." className="w-full border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-gold outline-none" value={articleForm.excerpt || ''} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})}/>
                    </div>
                </form>
            </div>
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-4 border-b pb-2">Publishing</h4>
                    <div className="flex items-center justify-between mb-4"><span className="text-sm font-bold text-gray-600">Status</span><div className="flex bg-gray-100 rounded p-1"><button type="button" onClick={() => setArticleForm({...articleForm, status: 'draft'})} className={`px-3 py-1 text-xs font-bold rounded ${articleForm.status === 'draft' ? 'bg-white shadow text-ink' : 'text-gray-400'}`}>Draft</button>{canPublish && (<button type="button" onClick={() => setArticleForm({...articleForm, status: 'published'})} className={`px-3 py-1 text-xs font-bold rounded ${articleForm.status === 'published' ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}>Public</button>)}</div></div>
                    <div className="flex items-center justify-between mb-6"><span className="text-sm font-bold text-gray-600">Featured Article</span><input type="checkbox" checked={articleForm.isFeatured || false} onChange={e => setArticleForm({...articleForm, isFeatured: e.target.checked})} className="w-5 h-5 accent-gold cursor-pointer"/></div>
                    <button type="submit" form="articleForm" className={`w-full text-white py-4 font-bold transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${canPublish ? 'bg-ink hover:bg-gold hover:text-ink' : 'bg-blue-600 hover:bg-blue-700'}`}><Save size={16} /> {editingId ? (canPublish ? 'Update Article' : 'Update & Request Approval') : (canPublish ? 'Publish Article' : 'Submit for Approval')}</button>
                </div>
                <div className="bg-white p-6 shadow-sm border border-gray-200">
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-4 border-b pb-2">Taxonomy</h4>
                    <div className="mb-4"><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label><select className="w-full border p-2 outline-none bg-white text-sm" value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><div className="flex justify-between items-center mb-1"><label className="block text-xs font-bold uppercase text-gray-500">Tags</label></div><input type="text" placeholder="Tech, Politics, Europe..." className="w-full border p-2 text-sm focus:ring-1 focus:ring-gold outline-none" value={tagsInput} onChange={e => { setTagsInput(e.target.value); setArticleForm({...articleForm, tags: e.target.value.split(',').map(t => t.trim())}); }}/></div>
                </div>
                 <div className="bg-white p-6 shadow-sm border border-gray-200"><h4 className="font-bold text-sm uppercase tracking-widest mb-4 border-b pb-2">Attribution</h4><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Published By</label><input type="text" placeholder={currentUser.name} className="w-full border p-2 text-sm focus:ring-1 focus:ring-gold outline-none" value={articleForm.author || ''} onChange={e => setArticleForm({...articleForm, author: e.target.value})}/></div>
            </div>
            <div className="lg:col-span-12 mt-8"><h3 className="font-serif font-bold text-xl mb-4 text-gray-700">Article Library</h3><div className="bg-white shadow-sm border border-gray-200 divide-y">{visibleArticles.length === 0 ? (<div className="p-8 text-center text-gray-500">No articles found. Start writing your first story!</div>) : (visibleArticles.map(article => (<div key={article.id} className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 gap-4"><div className="flex gap-4 items-center w-full md:w-auto"><div className="w-16 h-16 bg-gray-100 flex-shrink-0"><img src={article.imageUrl} className="w-full h-full object-cover" alt="" /></div><div><h4 className="font-bold font-serif text-lg leading-tight flex items-center gap-2">{article.title}{article.status === 'pending' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded uppercase font-bold">Pending Review</span>}</h4><div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1"><span className="uppercase text-gold-dark font-bold">{article.category}</span><span>• Published by {article.author}</span><span>• {article.date}</span><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${article.status === 'published' ? 'bg-green-100 text-green-700' : article.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{article.status}</span>{article.isFeatured && <span className="text-yellow-600 flex items-center gap-1"><Sparkles size={10}/> Featured</span>}</div></div></div><div className="flex gap-3"><button onClick={() => handleEditClick(article)} className="text-gray-500 hover:text-ink flex items-center gap-1 text-xs uppercase font-bold border border-gray-300 px-3 py-1 rounded hover:bg-white transition-all"><Edit size={14} /> Edit</button><button onClick={() => deleteArticle(article.id)} className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs uppercase font-bold border border-gray-300 px-3 py-1 rounded hover:bg-white transition-all"><Trash2 size={14} /> Delete</button></div></div>)))}</div></div>
          </div>
      )}

      {/* --- PUBLISHERS TAB --- */}
      {activeTab === 'publishers' && currentUser.role === 'admin' && (
            <div><div className="flex items-center justify-between mb-6"><h3 className="font-serif font-bold text-xl text-gray-700 flex items-center gap-2"><Users className="text-gold-dark"/> Publisher Management</h3></div><div className="bg-white shadow-sm border border-gray-200 overflow-hidden"><table className="w-full text-left border-collapse"><thead><tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold uppercase text-gray-600 tracking-wider"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">IP Address</th><th className="p-4">Joined</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{publisherUsers.length === 0 ? (<tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">No publishers registered yet.</td></tr>) : (publisherUsers.map(user => (<tr key={user.id} className="hover:bg-gray-50 transition-colors"><td className="p-4 font-bold text-ink text-sm">{user.name}</td><td className="p-4 text-sm text-gray-600">{user.email}</td><td className="p-4 text-xs font-mono text-gray-500">{user.ip || 'N/A'}</td><td className="p-4 text-xs text-gray-500">{user.joinedAt || 'Unknown'}</td><td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span></td><td className="p-4 text-right flex justify-end gap-2"><button onClick={() => toggleUserStatus(user.id)} className={`p-2 rounded transition-colors ${user.status === 'active' ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`} title={user.status === 'active' ? "Block Publisher" : "Activate Publisher"}>{user.status === 'active' ? <Ban size={16} /> : <Power size={16} />}</button><button onClick={() => { if(window.confirm('Are you sure you want to permanently remove this publisher?')) deleteUser(user.id); }} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors" title="Remove Publisher"><Trash2 size={16} /></button></td></tr>)))}</tbody></table></div></div>
      )}

      {/* --- E-PAPER TAB --- */}
      {activeTab === 'epaper' && currentUser.role === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-8">
                   <div className="bg-white p-6 shadow-sm border-t-4 border-gold h-fit">
                        <form onSubmit={handleEPaperSubmit} className="space-y-4">
                            <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2"><ImageIcon size={20}/> Upload E-Paper Page</h3>
                            <div><label className="block text-xs font-bold uppercase text-gray-500 mb-1">Issue Date</label><input type="date" required className="w-full border p-2 text-sm focus:ring-1 focus:ring-gold outline-none mb-2" value={ePaperDate} onChange={e => setEPaperDate(e.target.value)}/></div>
                            <div className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:bg-gray-50 relative group rounded"><input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><Upload className="mx-auto text-gray-400 mb-2 group-hover:text-gold" /><p className="text-sm text-gray-500">Click to upload Image (JPG/PNG)</p></div>
                            {ePaperUrl && (<div className="mt-4"><p className="text-xs font-bold text-green-600 mb-2">Preview:</p><img src={ePaperUrl} className="w-full h-auto border shadow-sm" /></div>)}
                            <button type="submit" disabled={!ePaperUrl} className={`w-full text-white py-3 font-bold transition-colors uppercase tracking-widest text-xs disabled:opacity-50 ${isChiefEditor ? 'bg-ink hover:bg-gold hover:text-ink' : 'bg-blue-600 hover:bg-blue-700'}`}>{isChiefEditor ? 'Add Page to Issue' : 'Submit Page for Review'}</button>
                        </form>
                   </div>
                   {isChiefEditor && (<div className="bg-white p-6 shadow-sm border border-gray-200"><h3 className="font-serif font-bold text-xl mb-4 text-gray-700 flex items-center gap-2"><Sparkles size={20} className="text-gold-dark"/> Clip Watermark</h3><form onSubmit={handleWatermarkSubmit}><div className="mb-4"><label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Watermark Text</label><div className="flex items-center border border-gray-300 rounded px-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gold"><Type size={14} className="text-gray-400 mr-2 shrink-0"/><input type="text" className="w-full py-2 text-sm font-bold text-ink bg-transparent outline-none" value={watermarkFormText} onChange={(e) => setWatermarkFormText(e.target.value)} placeholder="e.g. CJ NEWS HUB"/></div></div><div className="mb-4"><label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Watermark Logo (Optional)</label><div className="flex flex-col gap-2"><label className="cursor-pointer border border-dashed border-gray-300 rounded p-4 text-center hover:bg-gray-50 text-xs text-gray-500 flex flex-col items-center justify-center gap-1 transition-colors"><Upload size={16} /> Click to Upload Logo<input type="file" accept="image/*" className="hidden" onChange={handleWatermarkLogoUpload}/></label>{watermarkFormLogo && (<div className="relative group border border-gray-200 bg-gray-50 p-2 text-center"><img src={watermarkFormLogo} className="h-12 mx-auto object-contain" alt="Logo" /><button type="button" onClick={() => setWatermarkFormLogo(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"><X size={12}/></button></div>)}</div></div><button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white py-2 font-bold transition-colors uppercase tracking-widest text-xs rounded-sm">Save Settings</button></form></div>)}
               </div>
               <div className="lg:col-span-2"><h3 className="font-serif font-bold text-xl mb-4 text-gray-700">Archived Issues & Pages</h3><div className="space-y-8">{sortedDates.length === 0 && <p className="text-gray-500 italic">No E-Paper pages uploaded.</p>}{sortedDates.map(date => (<div key={date} className="bg-white shadow-sm border border-gray-200"><div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center"><h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-gold-dark"/>{formatDisplayDate(date)}</h4><span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{groupedPages[date].length} Pages</span></div><div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">{groupedPages[date].sort((a,b) => a.pageNumber - b.pageNumber).map(page => (<div key={page.id} className="relative group border border-gray-100"><div className="aspect-[2/3] overflow-hidden bg-gray-100"><img src={page.imageUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={`Page ${page.pageNumber}`} /></div><div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { if(window.confirm('Delete this page?')) deleteEPaperPage(page.id); }} className="bg-red-600 text-white p-1 rounded hover:bg-red-700 shadow-sm" title="Delete Page"><Trash2 size={12} /></button></div><div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1">Page {page.pageNumber}</div></div>))}</div></div>))}</div></div>
          </div>
      )}
    </div>
  );
};