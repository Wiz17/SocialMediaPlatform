import { useState } from "react";
import { supabase } from "../supabaseClient.jsx";

export const useFileUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [error3, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    bucketName: string,
  ): Promise<any | null> => {
    try {
      setUploading(true);
      setError(null);
      // Generate a unique file path
      const filePath = `${Date.now()}-${file.name}`;

      // Upload the file to the specified bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`uploads/${filePath}`, file);

      if (error) {
        setError(error.message);
        return null;
      }

      // Generate and return the public URL of the uploaded file
      const publicUrl = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      return publicUrl;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error3 };
};
