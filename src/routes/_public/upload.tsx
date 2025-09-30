import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { UTApi } from 'uploadthing/server';
import { useState } from 'react';

export const Route = createFileRoute('/_public/upload')({
  component: RouteComponent
});


function RouteComponent() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await uploadFile({ data: formData });
      if (res.success && res.url) {
        setUrl(res.url);
      } else {
        setError('Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
      <p className="text-xl font-semibold">News</p>

      <div className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {uploading && <p className="text-gray-500">Uploading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {url && (
          <div>
            <p className="text-green-600">Upload complete:</p>
            <img src={url} alt="Uploaded" className="max-w-xs mt-2 rounded shadow" />
          </div>
        )}
      </div>

      <div className="min-h-[1000px]" />
    </main>
  );
}


export const uploadFile = createServerFn({ method: 'POST' })
  .inputValidator((data) => {
    if (!(data instanceof FormData))
      throw new Error('Invalid form data');

    return data;
  })
  .handler(async ({ data }) => {
    const api = new UTApi({
      token: 'eyJhcGlLZXkiOiJza19saXZlXzAzZDRiZDg0NzFhOWJiMGE3OGVkM2ExODRlMjMwN2MxMjI3Mzg4ZTdlYmNmZDFjMDNlYjdiNjQwMjAyN2E3N2UiLCJhcHBJZCI6Ijd5eXp5azJ1dzYiLCJyZWdpb25zIjpbInNlYTEiXX0='
    });

    const file = data.get('file');

    if (!(file instanceof File))
      throw new Error('File is required');

    const uploaded = await api.uploadFiles(file, {

    });

    return {
      url: uploaded?.data?.url ?? null,
      success: !uploaded.error
    };
  });