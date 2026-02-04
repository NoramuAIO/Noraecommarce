const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Önce localStorage'dan, yoksa sessionStorage'dan token al
      this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    }
  }

  setToken(token: string | null, rememberMe: boolean = false) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        if (rememberMe) {
          localStorage.setItem('token', token);
          sessionStorage.removeItem('token');
        } else {
          sessionStorage.setItem('token', token);
          localStorage.removeItem('token');
        }
      } else {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
      throw new Error(error.message || 'Bir hata oluştu');
    }

    return response.json();
  }

  // Resmi sıkıştır
  private async compressImage(file: File, maxWidth: number = 400, quality: number = 0.7): Promise<File> {
    return new Promise((resolve) => {
      if (file.size < 100 * 1024) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const compressedFile = await this.compressImage(file);
    
    const formData = new FormData();
    formData.append('file', compressedFile);

    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Dosya yüklenemedi' }));
      throw new Error(error.message || 'Dosya yüklenemedi');
    }

    const data = await response.json();
    return { ...data, url: data.url };
  }

  // Auth
  async login(email: string, password: string, rememberMe: boolean = false) {
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token, rememberMe);
    return data;
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request<{ user: any; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token: string) {
    return this.request<{ message: string }>(`/auth/verify-email/${token}`, {
      method: 'POST',
    });
  }

  async resendVerificationEmail(email: string) {
    return this.request<{ message: string }>('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Products
  async getProducts(categoryId?: number) {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<any[]>(`/products${query}`);
  }

  async getBestSellers(limit: number = 8) {
    return this.request<any[]>(`/products/best-sellers?limit=${limit}`);
  }

  async getProduct(id: number | string) {
    return this.request<any>(`/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request<any>('/products', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProduct(id: number, data: any) {
    return this.request<any>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteProduct(id: number) {
    return this.request<any>(`/products/${id}`, { method: 'DELETE' });
  }

  // Categories
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async createCategory(data: { name: string; image?: string }) {
    return this.request<any>('/categories', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCategory(id: number, data: any) {
    return this.request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCategory(id: number) {
    return this.request<any>(`/categories/${id}`, { method: 'DELETE' });
  }

  // Orders
  async getOrders() {
    return this.request<any[]>('/orders');
  }

  async getMyOrders() {
    return this.request<any[]>('/orders/my');
  }

  async createOrder(productId: number, paymentMethod: string, couponCode?: string) {
    return this.request<any>('/orders', { method: 'POST', body: JSON.stringify({ productId, paymentMethod, couponCode }) });
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  }

  // Blog
  async getBlogPosts(categoryId?: number) {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request<any[]>(`/blog${query}`);
  }

  async getBlogPost(id: number | string) {
    return this.request<any>(`/blog/${id}`);
  }

  async createBlogPost(data: any) {
    return this.request<any>('/blog', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBlogPost(id: number, data: any) {
    return this.request<any>(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBlogPost(id: number) {
    return this.request<any>(`/blog/${id}`, { method: 'DELETE' });
  }

  // Blog Categories
  async getBlogCategories() {
    return this.request<any[]>('/blog/categories/all');
  }

  async createBlogCategory(data: { name: string }) {
    return this.request<any>('/blog/categories', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBlogCategory(id: number, data: { name: string }) {
    return this.request<any>(`/blog/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBlogCategory(id: number) {
    return this.request<any>(`/blog/categories/${id}`, { method: 'DELETE' });
  }

  // FAQ
  async getFaqs(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any[]>(`/faq${query}`);
  }

  async createFaq(data: any) {
    return this.request<any>('/faq', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateFaq(id: number, data: any) {
    return this.request<any>(`/faq/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteFaq(id: number) {
    return this.request<any>(`/faq/${id}`, { method: 'DELETE' });
  }

  // Tickets
  async getTickets() {
    return this.request<any[]>('/tickets');
  }

  async getMyTickets() {
    return this.request<any[]>('/tickets/my');
  }

  async getTicket(id: number) {
    return this.request<any>(`/tickets/${id}`);
  }

  async createTicket(data: { subject: string; message: string; category: string; priority?: string }) {
    return this.request<any>('/tickets', { method: 'POST', body: JSON.stringify(data) });
  }

  async replyToTicket(id: number, message: string) {
    return this.request<any>(`/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) });
  }

  async updateTicketStatus(id: number, status: string) {
    return this.request<any>(`/tickets/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  }

  async updateTicketAdminNote(id: number, adminNote: string) {
    return this.request<any>(`/tickets/${id}/note`, { method: 'PUT', body: JSON.stringify({ adminNote }) });
  }

  // Balance
  async getBalancePackages() {
    return this.request<any[]>('/balance/packages');
  }

  async createBalancePackage(data: any) {
    return this.request<any>('/balance/packages', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBalancePackage(id: number, data: any) {
    return this.request<any>(`/balance/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBalancePackage(id: number) {
    return this.request<any>(`/balance/packages/${id}`, { method: 'DELETE' });
  }

  // Users (Admin)
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async updateUser(id: number, data: any) {
    return this.request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async updateUserBalance(id: number, data: { newBalance: number; type: string; isRevenue: boolean; note?: string }) {
    return this.request<any>(`/users/${id}/balance`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/users/${id}`, { method: 'DELETE' });
  }

  // Settings
  async getSettings() {
    return this.request<Record<string, string>>('/settings');
  }

  async updateSettings(settings: Record<string, string>) {
    return this.request<Record<string, string>>('/settings', { method: 'PUT', body: JSON.stringify(settings) });
  }

  async testEmail(email: string) {
    return this.request<{ success: boolean }>('/settings/test-email', { method: 'POST', body: JSON.stringify({ email }) });
  }

  // Stats
  async getPublicStats() {
    return this.request<any>('/stats');
  }

  async getDashboardStats() {
    return this.request<any>('/stats/dashboard');
  }

  // Features
  async getFeatures() {
    return this.request<any[]>('/features');
  }

  async getFeaturesAdmin() {
    return this.request<any[]>('/features/admin');
  }

  async createFeature(data: { title: string; description: string; icon: string; color: string }) {
    return this.request<any>('/features', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateFeature(id: number, data: any) {
    return this.request<any>(`/features/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteFeature(id: number) {
    return this.request<any>(`/features/${id}`, { method: 'DELETE' });
  }

  // Testimonials
  async getTestimonials() {
    return this.request<any[]>('/testimonials');
  }

  async getTestimonialsAdmin() {
    return this.request<any[]>('/testimonials/admin');
  }

  async createTestimonial(data: { name: string; role: string; content: string; rating: number }) {
    return this.request<any>('/testimonials', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateTestimonial(id: number, data: any) {
    return this.request<any>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteTestimonial(id: number) {
    return this.request<any>(`/testimonials/${id}`, { method: 'DELETE' });
  }

  // Product Changelogs
  async getProductChangelogs(productId: number) {
    return this.request<any[]>(`/products/${productId}/changelogs`);
  }

  async createProductChangelog(productId: number, data: { version: string; changes: string[] }) {
    return this.request<any>(`/products/${productId}/changelogs`, { method: 'POST', body: JSON.stringify(data) });
  }

  async deleteProductChangelog(changelogId: number) {
    return this.request<any>(`/products/changelogs/${changelogId}`, { method: 'DELETE' });
  }

  // Product Reviews
  async getProductReviews(productId: number) {
    return this.request<any[]>(`/products/${productId}/reviews`);
  }

  async getProductReviewsAdmin(productId: number) {
    return this.request<any[]>(`/products/${productId}/reviews/admin`);
  }

  async getAllReviewsAdmin() {
    return this.request<any[]>('/products/admin/reviews/all');
  }

  async createProductReview(productId: number, data: { rating: number; comment: string; userName: string }) {
    return this.request<any>(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) });
  }

  async updateProductReview(reviewId: number, data: { approved?: boolean }) {
    return this.request<any>(`/products/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteProductReview(reviewId: number) {
    return this.request<any>(`/products/reviews/${reviewId}`, { method: 'DELETE' });
  }

  // References
  async getReferences() {
    return this.request<any[]>('/references');
  }

  async getReferencesAdmin() {
    return this.request<any[]>('/references/admin');
  }

  async createReference(data: { name: string; image: string; website?: string; discord?: string }) {
    return this.request<any>('/references', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateReference(id: number, data: any) {
    return this.request<any>(`/references/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteReference(id: number) {
    return this.request<any>(`/references/${id}`, { method: 'DELETE' });
  }

  // Favorites
  async getFavorites() {
    return this.request<any[]>('/favorites');
  }

  async addFavorite(productId: number) {
    return this.request<any>(`/favorites/${productId}`, { method: 'POST' });
  }

  async removeFavorite(productId: number) {
    return this.request<any>(`/favorites/${productId}`, { method: 'DELETE' });
  }

  async checkFavorite(productId: number) {
    return this.request<{ isFavorite: boolean }>(`/favorites/check/${productId}`);
  }

  async getProductNotifications() {
    return this.request<any[]>('/favorites/notifications');
  }

  async markNotificationRead(notificationId: number) {
    return this.request<any>(`/favorites/notifications/${notificationId}/read`, { method: 'POST' });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/favorites/notifications/read-all', { method: 'POST' });
  }

  // Live Chat (Public)
  async startLiveChat(data: { userName?: string; userEmail?: string; userId?: number }) {
    return this.request<any>('/livechat/start', { method: 'POST', body: JSON.stringify(data) });
  }

  async getLiveChatBySession(sessionId: string) {
    return this.request<any>(`/livechat/session/${sessionId}`);
  }

  async sendLiveChatMessage(sessionId: string, content: string) {
    return this.request<any>(`/livechat/session/${sessionId}/message`, { method: 'POST', body: JSON.stringify({ content }) });
  }

  // Live Chat (Admin)
  async getActiveChats() {
    return this.request<any[]>('/livechat/admin/active');
  }

  async getAllChats() {
    return this.request<any[]>('/livechat/admin/all');
  }

  async getWaitingChatCount() {
    return this.request<{ count: number }>('/livechat/admin/waiting-count');
  }

  async getLiveChatById(id: number) {
    return this.request<any>(`/livechat/admin/${id}`);
  }

  async sendAdminChatMessage(chatId: number, content: string) {
    return this.request<any>(`/livechat/admin/${chatId}/message`, { method: 'POST', body: JSON.stringify({ content }) });
  }

  async closeLiveChat(chatId: number) {
    return this.request<any>(`/livechat/admin/${chatId}/close`, { method: 'PUT' });
  }

  async deleteLiveChat(chatId: number) {
    return this.request<any>(`/livechat/admin/${chatId}`, { method: 'DELETE' });
  }

  // Coupons
  async getCoupons() {
    return this.request<any[]>('/coupons');
  }

  async getCoupon(id: number) {
    return this.request<any>(`/coupons/${id}`);
  }

  async createCoupon(data: {
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxUses?: number;
    expiresAt?: string;
    productIds?: number[];
  }) {
    return this.request<any>('/coupons', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateCoupon(
    id: number,
    data: {
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      maxUses?: number;
      expiresAt?: string;
      active?: boolean;
      productIds?: number[];
    }
  ) {
    return this.request<any>(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteCoupon(id: number) {
    return this.request<any>(`/coupons/${id}`, { method: 'DELETE' });
  }

  async validateCoupon(code: string) {
    return this.request<any>(`/coupons/validate/${code}`, { method: 'POST' });
  }

  async calculateDiscount(couponCode: string, productId: number | null, amount: number) {
    return this.request<any>('/coupons/calculate-discount', {
      method: 'POST',
      body: JSON.stringify({ couponCode, productId, amount }),
    });
  }

  // Bundles
  async getBundles() {
    return this.request<any[]>('/bundles');
  }

  async getBundle(id: number) {
    return this.request<any>(`/bundles/${id}`);
  }

  async createBundle(data: {
    name: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxUses?: number;
    expiresAt?: string;
    categoryId: number;
  }) {
    return this.request<any>('/bundles', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateBundle(
    id: number,
    data: {
      name?: string;
      description?: string;
      discountType?: 'percentage' | 'fixed';
      discountValue?: number;
      maxUses?: number;
      expiresAt?: string;
      active?: boolean;
      categoryId?: number;
    }
  ) {
    return this.request<any>(`/bundles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteBundle(id: number) {
    return this.request<any>(`/bundles/${id}`, { method: 'DELETE' });
  }

  async calculateBundleDiscount(bundleId: number, productId: number, amount: number) {
    return this.request<any>('/bundles/calculate-discount', {
      method: 'POST',
      body: JSON.stringify({ bundleId, productId, amount }),
    });
  }

  // Email Verification Whitelist
  async getEmailVerificationWhitelist() {
    return this.request<any[]>('/settings/email-verification-whitelist');
  }

  async addToEmailVerificationWhitelist(email: string) {
    return this.request<any>('/settings/email-verification-whitelist', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async removeFromEmailVerificationWhitelist(email: string) {
    return this.request<any>(`/settings/email-verification-whitelist/${email}`, {
      method: 'DELETE',
    });
  }

  // Popups
  async getActivePopup() {
    return this.request<any>('/popups/active');
  }

  async getPopups() {
    return this.request<any[]>('/popups');
  }

  async getPopup(id: number) {
    return this.request<any>(`/popups/${id}`);
  }

  async createPopup(data: {
    title: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonLink?: string;
    enabled?: boolean;
  }) {
    return this.request<any>('/popups', { method: 'POST', body: JSON.stringify(data) });
  }

  async updatePopup(
    id: number,
    data: {
      title?: string;
      description?: string;
      image?: string;
      buttonText?: string;
      buttonLink?: string;
      enabled?: boolean;
    }
  ) {
    return this.request<any>(`/popups/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deletePopup(id: number) {
    return this.request<any>(`/popups/${id}`, { method: 'DELETE' });
  }

  // Referrals
  async addReferral(referredId: number, website?: string, discord?: string) {
    return this.request<any>('/referrals', {
      method: 'POST',
      body: JSON.stringify({ referredId, website, discord }),
    });
  }

  async getReferralsForUser(userId: number) {
    return this.request<any[]>(`/referrals/for-user/${userId}`);
  }

  async getReferralsGivenByUser(userId: number) {
    return this.request<any[]>(`/referrals/given-by-user/${userId}`);
  }

  async getAllReferrals() {
    return this.request<any[]>('/referrals');
  }

  async updateReferral(id: number, data: any) {
    return this.request<any>(`/referrals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReferral(id: number) {
    return this.request<any>(`/referrals/${id}`, { method: 'DELETE' });
  }

  async approveReferral(id: number) {
    return this.request<any>(`/referrals/${id}/approve`, { method: 'POST' });
  }

  async rejectReferral(id: number) {
    return this.request<any>(`/referrals/${id}/reject`, { method: 'POST' });
  }

  async generateReferralLink() {
    return this.request<{ link: string }>('/referrals/generate-link', { method: 'POST' });
  }

  async applyReferralLink(link: string) {
    return this.request<any>('/referrals/apply-link', {
      method: 'POST',
      body: JSON.stringify({ link }),
    });
  }
}

export const api = new ApiClient();
export default api;
