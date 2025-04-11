'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

interface Upload {
  id: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  uploaded_at: string;
}

const Dashboard = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const router = useRouter();
  const API_URL =  'https://job-os-internship-2.vercel.app';


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }

    // Decode token to get its expiration time
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

  

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      router.push('/signin');
    } else {
      fetchUploads(token);
    }
  }, [router]);

  const fetchUploads = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/upload`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUploads(data.uploads);
      } else {
        setError('Failed to fetch uploads');
      }
    } catch (error) {
      if(error)
      setError('Failed to fetch uploads');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploadLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        fetchUploads(token);
        setFile(null);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (error) {
      if(error)
      setError('Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (uploadId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
      return;
    }
    setDeletingId(uploadId);
    setError('');
    try {
      const res = await fetch(`${API_URL}/upload/${uploadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setUploads((prev) => prev.filter((u) => u.id !== uploadId));
      } else {
        setError('Failed to delete file');
      }
    } catch (error) {
      if(error)
      setError('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = () => {
    setSignOutLoading(true);
    localStorage.removeItem('token');
    router.push('/signin');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>JOB OS</h1>
        <button className={styles.signOutBtn} onClick={handleSignOut} disabled={signOutLoading}>
          {signOutLoading ? <div className={styles.spinner}></div> : 'Sign Out'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.section}>
        <h2>Upload Your CV</h2>
        <form className={styles.form} onSubmit={handleUpload}>
          <input type="file" onChange={handleFileChange} required />
          <button type="submit" className={styles.uploadBtn} disabled={uploadLoading}>
            {uploadLoading ? <div className={styles.spinner}></div> : 'Upload'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2>Your Documents</h2>
        {uploads.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <ul className={styles.uploadList}>
            {uploads.map((upload) => (
              <li key={upload.id} className={styles.uploadItem}>
                <a href={`${upload.fileUrl}?fl_attachment=true`} download target="_blank" rel="noopener noreferrer">
                  {upload.fileName} ({upload.fileType})
                </a>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(upload.id)}
                  disabled={deletingId === upload.id}
                >
                  {deletingId === upload.id ? <div className={styles.spinner}></div> : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
