import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { TheaterRequest } from '../types';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

export function useTheaterForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<TheaterRequest>({
    name: '',
    city: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: TheaterRequest) => adminApi.createTheater(data),
    onSuccess: () => {
      toast('Theater added successfully!', 'success');
      setFormData({ name: '', city: '', address: '' });
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
    },
    onError: (error) => {
      let msg = 'Failed to add theater';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast(msg, 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, req: TheaterRequest }) => adminApi.updateTheater(data.id, data.req),
    onSuccess: () => {
      toast('Theater updated successfully!', 'success');
      cancelEdit();
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
    },
    onError: (error) => {
      let msg = 'Failed to update theater';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast(msg, 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteTheater(id),
    onSuccess: () => {
      toast('Theater deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['theaters'] });
    },
    onError: (error) => {
      let msg = 'Failed to delete theater';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.detail) {
          msg = error.response.data.detail;
        } else if (error.response?.data?.message) {
          msg = error.response.data.message;
        }
      }
      toast(msg, 'error');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, req: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (theater: any) => {
    setIsEditing(true);
    setEditingId(theater.id);
    setFormData({
      name: theater.name,
      city: theater.city,
      address: theater.address
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', city: '', address: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this theater?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  };
}
