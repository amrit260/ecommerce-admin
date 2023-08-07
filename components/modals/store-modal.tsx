'use client';
import axios from 'axios';
import React, { useState } from 'react';
import Modal from '@/components/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreModal } from '@/hooks/use-store-modal';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
interface StoreModalProps {
  // Add props here
}

const fromSchema = z.object({
  name: z.string().min(1),
});

const StoreModal: React.FC<StoreModalProps> = (props) => {
  const StoreModal = useStoreModal();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      name: '',
    },
  });

  const router = useRouter();
  let onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stores', values);
      window.location.assign(`/${response.data.data.id}`);
    } catch (err) {
      toast.error('something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories "
      isOpen={StoreModal.isOpen}
      onClose={StoreModal.onClose}
    >
      <div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="E-commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  type="button"
                  onClick={StoreModal.onClose}
                  variant={'outline'}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button disabled={loading}>Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
