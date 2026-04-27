class AuthManager {
  static async checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Auth check error:', error);
      return null;
    }
  }

  static async logout() {
    try {
      await supabase.auth.signOut();
      window.location.href = 'landing.html';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

// Check auth on pages that require it (like index.html)
window.addEventListener('DOMContentLoaded', async () => {
  if (document.body.getAttribute('data-require-auth') === 'true') {
    const user = await AuthManager.checkAuth();
    if (!user) {
      window.location.href = 'landing.html';
    }
  }
});
