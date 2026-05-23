const BASE_URL = 'http://localhost:8000/api/v1';

export const uploadDataset = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload/csv`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to upload file');
  }

  return response.json();
};

export const analyzeDataset = async (datasetId: string) => {
  const response = await fetch(`${BASE_URL}/analysis/${datasetId}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze dataset');
  }

  return response.json();
};
export const generatePlan = async (datasetId: string) => {
  const response = await fetch(`${BASE_URL}/planner/${datasetId}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate plan');
  }

  return response.json();
};

export const getPreviewData = async (datasetId: string) => {
  const response = await fetch(`${BASE_URL}/preview_data/${datasetId}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch preview data');
  }

  return response.json();
};
