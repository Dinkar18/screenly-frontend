import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { moviesApi } from '@/features/movies/api/movies';
import { ShowtimeRequest } from '../types';
import { useToast } from '@/hooks/useToast';
import axios from 'axios';

export function useShowtimeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTheaterId, setSelectedTheaterId] = useState('');
  
  const [formData, setFormData] = useState<ShowtimeRequest>({
    movieId: '',
    screenId: '',
    startTime: '',
    price: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: moviesPage, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['movies', 'all'],
    queryFn: () => moviesApi.getAllMovies(0, 100)
  });
  
  const movies = moviesPage?.content || [];

  const { data: theaters = [], isLoading: isLoadingTheaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: adminApi.getTheaters
  });

  const { data: screens = [], isLoading: isLoadingScreens } = useQuery({
    queryKey: ['screens', selectedTheaterId],
    queryFn: () => adminApi.getScreensByTheater(selectedTheaterId),
    enabled: !!selectedTheaterId
  });

  const createMutation = useMutation({
    mutationFn: (data: ShowtimeRequest) => {
      let formattedTime = data.startTime;
      if (formattedTime.split(':').length === 2) {
        formattedTime += ':00';
      }
      return adminApi.createShowtime({
        ...data,
        startTime: formattedTime
      });
    },
    onSuccess: () => {
      toast('Showtime scheduled successfully!', 'success');
      setFormData(prev => ({ ...prev, startTime: '', price: 0 }));
      queryClient.invalidateQueries({ queryKey: ['showtimes', selectedTheaterId] });
    },
    onError: (error) => {
      let msg = 'Failed to schedule showtime';
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          msg = data.errors.join('\n');
        } else if (data.detail) {
          msg = data.detail;
        } else if (data.message) {
          msg = data.message;
        }
      }
      toast(msg, 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, req: ShowtimeRequest }) => {
      let formattedTime = data.req.startTime;
      if (formattedTime.split(':').length === 2) {
        formattedTime += ':00';
      }
      return adminApi.updateShowtime(data.id, {
        ...data.req,
        startTime: formattedTime
      });
    },
    onSuccess: () => {
      toast('Showtime updated successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['showtimes', selectedTheaterId] });
      cancelEdit();
    },
    onError: (error) => {
      let msg = 'Failed to update showtime';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast(msg, 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteShowtime(id),
    onSuccess: () => {
      toast('Showtime deleted successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['showtimes', selectedTheaterId] });
    },
    onError: (error) => {
      let msg = 'Failed to delete showtime';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast(msg, 'error');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movieId || !formData.screenId || !formData.startTime) {
      toast('Please fill all required fields', 'error');
      return;
    }
    if (isEditing && editingId) {
      updateMutation.mutate({ id: editingId, req: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (showtime: any) => {
    setIsEditing(true);
    setEditingId(showtime.id);
    setSelectedTheaterId(showtime.theaterId);
    setFormData({
      movieId: showtime.movieId,
      screenId: showtime.screenId,
      startTime: showtime.startTime.substring(0, 16), // datetime-local format YYYY-MM-DDTHH:mm
      price: showtime.price
    });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(prev => ({ ...prev, startTime: '', price: 0 }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this showtime?')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    formData,
    selectedTheaterId,
    setSelectedTheaterId,
    handleChange,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    movies,
    theaters,
    screens,
    isLoadingMovies,
    isLoadingTheaters,
    isLoadingScreens,
    isEditing,
    startEdit,
    cancelEdit,
    handleDelete
  };
}
