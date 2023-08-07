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
import { Billboard, Size, Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import { useOrigin } from '@/hooks/use-origin';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { sizeSchema } from '@/schemas/schema';

// import z from 'zod';

interface SizeFormProps {
  size: Size | null;
}
type SizeFormType = z.infer<typeof sizeSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ size }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = size ? 'Edit size' : 'Create size';
  const description = size ? 'Edit a size ' : 'Add a new Bilboard';
  const toastMessage = size ? 'size updated' : 'size created';
  const action = size ? 'Save changes' : 'Create';

  const router = useRouter();
  const form = useForm<SizeFormType>({
    resolver: zodResolver(sizeSchema),
    defaultValues: size || {
      name: '',
      value: '',
    },
  });

  const params = useParams();

  const onSubmit = async (data: SizeFormType) => {
    try {
      setLoading(true);
      if (size) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push('/');
      toast.success('size deleted');
    } catch (error) {
      toast.error('Make sure to delete all products using this size');
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
        {size && (
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
                      placeholder="Size name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
                  </FormControl>
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

export default SizeForm;
