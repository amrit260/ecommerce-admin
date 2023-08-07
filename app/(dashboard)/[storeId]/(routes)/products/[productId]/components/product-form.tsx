'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import AlertModal from '@/components/modals/alert-modal';
import { useOrigin } from '@/hooks/use-origin';
import ImageUpload from '@/components/ui/image-upload';
import { productSchema } from '@/schemas/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFormProps {
  product:
    | (Product & {
        images: Image[];
      })
    | null;
  sizes: Size[];
  colors: Color[];
  categories: Category[];
}
type ProductFormType = z.infer<typeof productSchema>;

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  sizes,
  colors,
  categories,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = product ? 'Edit product' : 'Create product';
  const description = product ? 'Edit a product ' : 'Add a new Bilboard';
  const toastMessage = product ? 'product updated' : 'product created';
  const action = product ? 'Save changes' : 'Create';

  const router = useRouter();
  const form = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { ...product, price: parseFloat(String(product.price)) }
      : {
          name: '',
          images: [],
          price: 0,
          categoryId: '',
          colorId: '',
          sizeId: '',
          isFeatured: false,
          isArchived: false,
        },
  });

  const params = useParams();

  const onSubmit = async (data: ProductFormType) => {
    try {
      setLoading(true);
      if (product) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push('/');
      toast.success('product deleted');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        {product && (
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>

                <FormControl>
                  {/* <Input
                    disabled={loading}
                    placeholder="Billboard label"
                    {...field}
                  /> */}
                  <ImageUpload
                    disabled={loading}
                    multiple
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((data) => data.url !== url)
                      )
                    }
                    value={field.value.map((image) => image.url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                      {colors.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                      {sizes.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex p-2 flex-row items-start space-x-3 space-y-0 rounded-md border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    {/* <FormLabel>Archived</FormLabel> */}
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex p-2 flex-row items-start space-x-3 space-y-0 rounded-md border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    {/* <FormLabel>Archived</FormLabel> */}
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will appear anywhere in the store.
                    </FormDescription>
                  </div>
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

export default ProductForm;
