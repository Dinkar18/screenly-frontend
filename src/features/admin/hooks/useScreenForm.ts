import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { ScreenRequest } from '../types';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

export function useScreenForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ScreenRequest>({
    theaterId: '',
    name: '',
    capacity: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: theaters = [], isLoading: isLoadingTheaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: adminApi.getTheaters
  });

  const createMutation = useMutation({
    mutationFn: (data: ScreenRequest) => adminApi.createScreen(data),
    onSuccess: () => {
      toast('Screen added successfully!', 'success');
      setFormData(prev => ({ ...prev, name: '', capacity: 0 }));
      queryClient.invalidateQueries({ queryKey: ['screens', formData.theaterId] });
    },
    onError: (error) => {
      let msg = 'Failed to add screen';
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

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, req: ScreenRequest }) => adminApi.updateScreen(data.id, data.req),
    onSuccess: () => {
      toast('Screen updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['screens', formData.theaterId] });
      cancelEdit();
    },
    onError: (error) => {
      let msg = 'Failed to update screen';
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteScreen(id),
    onSuccess: () => {
      toast('Screen deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['screens'] });
    },
    onError: (error) => {
      let msg = 'Failed to delete screen';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.theaterId) {
      toast('Please select a theater', 'error');
      return;
    }
    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, req: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (screen: any) => {
    setIsEditing(true);
    setEditingId(screen.id);
    setFormData({
      theaterId: screen.theaterId,
      name: screen.name,
      capacity: screen.capacity
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(prev => ({ ...prev, name: '', capacity: 0 }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this screen?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    theaters,
    isLoadingTheaters,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  };
}
