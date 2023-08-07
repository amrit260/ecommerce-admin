'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Category, Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
import ImageUpload from '@/components/ui/image-upload';
import { categorySchema } from '@/schemas/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';

// import z from 'zod';

interface CategoryFormProps {
  category: Category | null;
  billboards: Billboard[];
}
type CategoryFormType = z.infer<typeof categorySchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  billboards,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = category ? 'Edit category' : 'Create category';
  const description = category ? 'Edit a category ' : 'Add a new Bilboard';
  const toastMessage = category ? 'category updated' : 'category created';
  const action = category ? 'Save changes' : 'Create';

  const router = useRouter();
  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      name: '',
      billboardId: '',
    },
  });

  const params = useParams();

  const onSubmit = async (data: CategoryFormType) => {
    try {
      setLoading(true);
      if (category) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      router.push('/');
      toast.success('category deleted');
    } catch (error) {
      toast.error('Make sure to delete all products using this category');
    } finally {
      setLoading(false);
    }
  };

  const origin = useOrigin();

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {category && (
          <Button
            variant={'destructive'}
            size={'sm'}
            onClick={() => setOpen(!open)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    {' '}
                    <SelectTrigger>
                      <FormControl>
                        <SelectValue
                          placeholder="sdlfkaj"
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </SelectTrigger>
                    <SelectContent>
                      {billboards.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
