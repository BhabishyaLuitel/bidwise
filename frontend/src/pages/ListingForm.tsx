import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useListingStore } from '../stores/listingStore';
import { useUserStore } from '../stores/userStore';
import { itemsApi } from '../lib/api/items';
import toast from 'react-hot-toast';

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  startingPrice: z.number().min(1, 'Starting price must be at least 1'),
  duration: z.number().min(1, 'Please select auction duration'),
});

type ListingInputs = z.infer<typeof listingSchema>;

const CATEGORIES = [
  'Electronics',
  'Collectibles',
  'Fashion',
  'Home & Garden',
  'Art',
  'Sports',
  'Vehicles',
  'Jewelry',
];

const DURATIONS = [
  { value: 1, label: '1 day' },
  { value: 3, label: '3 days' },
  { value: 5, label: '5 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
];

export function ListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getItem, updateItem, addItem } = useListingStore();
  const isEditing = Boolean(id);
  
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ListingInputs>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      duration: 7,
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const item = getItem(id);
      if (item) {
        setValue('title', item.title);
        setValue('description', item.description);
        setValue('category', item.category);
        setValue('startingPrice', item.startingPrice);
        setImages(item.images);
      }
    }
  }, [id, isEditing, setValue, getItem]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageError(null);

    if (files.length + images.length > 4) {
      setImageError('Maximum 4 images allowed');
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingInputs) => {
    if (!user) {
      toast.error('You must be logged in to create a listing');
      return;
    }

    if (images.length === 0) {
      setImageError('At least one image is required');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert base64 images to files
      const imageFiles = await Promise.all(
        images.map(async (base64String) => {
          const response = await fetch(base64String);
          const blob = await response.blob();
          return new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
        })
      );

      // Calculate end time based on duration
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + data.duration);
      
      // Format the date in MySQL datetime format (YYYY-MM-DD HH:mm:ss)
      const formattedEndTime = endTime.toISOString().slice(0, 19).replace('T', ' ');

      if (isEditing && id) {
        // Update existing item
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('starting_price', data.startingPrice.toString());
        formData.append('end_time', formattedEndTime);
        
        // Append each image file
        imageFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });

        const response = await itemsApi.update(id, formData);

        // Update local state
        updateItem(id, {
          ...response.data,
          updatedAt: new Date(),
        });
        
        toast.success('Listing updated successfully');
      } else {
        // Create new item
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('starting_price', data.startingPrice.toString());
        formData.append('end_time', formattedEndTime);
        
        // Append each image file
        imageFiles.forEach((file, index) => {
          formData.append(`images[${index}]`, file);
        });

        const response = await itemsApi.create(formData);

        // Add to local state
        const newItem = {
          ...response.data,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addItem(newItem);
        
        toast.success('Listing created successfully');
      }
      
      navigate('/sell');
    } catch (error) {
      console.error('Failed to save listing:', error);
      toast.error(
        isEditing 
          ? 'Failed to update listing. Please try again.' 
          : 'Failed to create listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-3xl px-4">
        <button
          onClick={() => navigate('/sell')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Listing' : 'Create New Listing'}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images (Max 4)
              </label>
              <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-8 w-8 text-gray-400" />
                  </label>
                )}
              </div>
              {imageError && (
                <p className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {imageError}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter item title"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Describe your item in detail"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Starting Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('startingPrice', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
              {errors.startingPrice && (
                <p className="mt-2 text-sm text-red-600">{errors.startingPrice.message}</p>
              )}
            </div>

            {/* Duration */}
            {!isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Auction Duration
                </label>
                <select
                  {...register('duration', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {DURATIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {errors.duration && (
                  <p className="mt-2 text-sm text-red-600">{errors.duration.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/sell')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing ? 'Updating...' : 'Creating...'
                  : isEditing ? 'Update Listing' : 'Create Listing'
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}