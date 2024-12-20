import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://arxkebsmrbstwstaxbig.supabase.co"; 
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyeGtlYnNtcmJzdHdzdGF4YmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyNDkwNiwiZXhwIjoyMDQ4NzAwOTA2fQ.B5q-bi3Rz33jzgkz8QgGNQyKso3g2clpNxxc5Uu-_vk"; // Replace with your API key

const supabase = createClient(SUPABASE_URL, API_KEY);

export const useFileUploader = () => {
  const [uploading, setUploading] = useState(true);
  const [error3, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, bucketName: string): Promise<any | null> => {


    try {
      // Generate a unique file path
      const filePath = `${Date.now()}-${file.name}`;

      // Upload the file to the specified bucket
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`uploads/${filePath}`, file);

      if (error) {
        console.error("Error uploading file:", error.message);
        setError(error.message);
        return null;
      }

      // Generate and return the public URL of the uploaded file
      const publicUrl  = supabase.storage.from(bucketName).getPublicUrl(data.path);
      return publicUrl;
    } catch (err: any) {
      console.error("Error in uploadFile hook:", err.message);
      setError(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error3 };
};


