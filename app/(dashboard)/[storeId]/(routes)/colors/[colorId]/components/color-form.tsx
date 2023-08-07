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
import { Billboard, Color, Size, Store } from '@prisma/client';
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
import { sizeSchema as colorschema } from '@/schemas/schema';

// import z from 'zod';

interface ColorFormProps {
  color: Color | null;
}
type ColorFormType = z.infer<typeof colorschema>;

const ColorForm: React.FC<ColorFormProps> = ({ color }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = color ? 'Edit color' : 'Create color';
  const description = color ? 'Edit a color ' : 'Add a new Bilboard';
  const toastMessage = color ? 'color updated' : 'color created';
  const action = color ? 'Save changes' : 'Create';

  const router = useRouter();
  const form = useForm<ColorFormType>({
    resolver: zodResolver(colorschema),
    defaultValues: color || {
      name: '',
      value: '',
    },
  });

  const params = useParams();

  const onSubmit = async (data: ColorFormType) => {
    try {
      setLoading(true);
      if (color) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push('/');
      toast.success('color deleted');
    } catch (error) {
      toast.error('Make sure to delete all products using this color');
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
        {color && (
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
                      placeholder="Color name"
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
                <FormItem className="cursor-pointer">
                  <FormLabel>Pick a color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        type="color"
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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

export default ColorForm;
