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
import { Billboard, Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
import ImageUpload from '@/components/ui/image-upload';
import { billboardSchema } from '@/schemas/schema';

// import z from 'zod';

interface BillboardFormProps {
  billboard: Billboard | null;
}
type BillboardFormType = z.infer<typeof billboardSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ billboard }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = billboard ? 'Edit billboard' : 'Create billboard';
  const description = billboard ? 'Edit a billboard ' : 'Add a new Bilboard';
  const toastMessage = billboard ? 'Billboard updated' : 'Billboard created';
  const action = billboard ? 'Save changes' : 'Create';

  const router = useRouter();
  const form = useForm<BillboardFormType>({
    resolver: zodResolver(billboardSchema),
    defaultValues: billboard || {
      label: '',
      imageUrl: '',
    },
  });

  const params = useParams();

  const onSubmit = async (data: BillboardFormType) => {
    try {
      setLoading(true);
      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push('/');
      toast.success('billboard deleted');
    } catch (error) {
      toast.error('Make sure to delete all categories using this billboard');
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
        {billboard && (
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>

                <FormControl>
                  {/* <Input
                    disabled={loading}
                    placeholder="Billboard label"
                    {...field}
                  /> */}
                  <ImageUpload
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
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

export default BillboardForm;
