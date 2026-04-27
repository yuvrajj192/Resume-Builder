class StorageManager {
  static async saveDraft(resumeData, draftName = null) {
    try {
      const user = await AuthManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: { user: userData } } = await supabase.auth.getUser();
      const userId = userData.id;

      const timestamp = new Date().toISOString();
      const name = draftName || `Resume Draft - ${new Date().toLocaleDateString()}`;

      const { data, error } = await supabase
        .from('resume_drafts')
        .insert([
          {
            user_id: userId,
            name: name,
            content: resumeData,
            created_at: timestamp,
            updated_at: timestamp,
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  static async updateDraft(draftId, resumeData) {
    try {
      const timestamp = new Date().toISOString();

      const { data, error } = await supabase
        .from('resume_drafts')
        .update({
          content: resumeData,
          updated_at: timestamp,
        })
        .eq('id', draftId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  }

  static async getDrafts() {
    try {
      const user = await AuthManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: { user: userData } } = await supabase.auth.getUser();
      const userId = userData.id;

      const { data, error } = await supabase
        .from('resume_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching drafts:', error);
      return [];
    }
  }

  static async getDraft(draftId) {
    try {
      const { data, error } = await supabase
        .from('resume_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching draft:', error);
      return null;
    }
  }

  static async deleteDraft(draftId) {
    try {
      const { error } = await supabase
        .from('resume_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      throw error;
    }
  }

  static async saveToHistory(resumeData, pdfFile, templateName) {
    try {
      const user = await AuthManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: { user: userData } } = await supabase.auth.getUser();
      const userId = userData.id;

      const timestamp = new Date().toISOString();
      const fileName = `resume_${userId}_${Date.now()}.pdf`;

      // Upload PDF to storage
      let pdfUrl = null;
      if (pdfFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resume-pdfs')
          .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('resume-pdfs')
          .getPublicUrl(fileName);

        pdfUrl = urlData.publicUrl;
      }

      // Save resume history
      const { data, error } = await supabase
        .from('resume_history')
        .insert([
          {
            user_id: userId,
            name: `Resume - ${new Date().toLocaleDateString()}`,
            content: resumeData,
            template: templateName,
            pdf_url: pdfUrl,
            created_at: timestamp,
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving to history:', error);
      throw error;
    }
  }

  static async getHistory() {
    try {
      const user = await AuthManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: { user: userData } } = await supabase.auth.getUser();
      const userId = userData.id;

      const { data, error } = await supabase
        .from('resume_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  }

  static async deleteHistory(historyId) {
    try {
      const { error } = await supabase
        .from('resume_history')
        .delete()
        .eq('id', historyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting history entry:', error);
      throw error;
    }
  }

  static async uploadPDF(pdfBlob, fileName) {
    try {
      const user = await AuthManager.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const { data: { user: userData } } = await supabase.auth.getUser();
      const userId = userData.id;

      const fullFileName = `${userId}/${Date.now()}_${fileName}`;

      const { data, error } = await supabase.storage
        .from('resume-pdfs')
        .upload(fullFileName, pdfBlob);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('resume-pdfs')
        .getPublicUrl(fullFileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  }
}
