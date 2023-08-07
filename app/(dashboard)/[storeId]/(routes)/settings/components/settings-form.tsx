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
import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import ApiAlert from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

// import z from 'zod';

interface SettingsFormProps {
  store: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingFormType = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ store }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SettingFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: store,
  });

  const params = useParams();

  const onSubmit = async (data: SettingFormType) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast.success('update success');
    } catch (error) {
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast.success('store deleted');
    } catch (error) {
      toast.error('Make sure to delete all products and categories');
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
        <Heading title="Settings" description={'Manage store preferences'} />
        <Button
          variant={'destructive'}
          size={'sm'}
          onClick={() => setOpen(!open)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="test"
        variant="public"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};

export default SettingsForm;
