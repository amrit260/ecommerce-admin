'use client';

import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Store } from '@prisma/client';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  Check,
  CheckIcon,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from './ui/command';
import { CommandSeparator } from 'cmdk';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({
  className,
  items = [],
}) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => {
    return { label: item.name, value: item.id };
  });

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          arial-label="Select a store"
          className={cn('w-[200px] justify-between')}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          Current Store
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store.." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="stores">
              {formattedItems.map((item) => {
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => onStoreSelect(item)}
                    className="text-sm cursor-pointer"
                  >
                    {' '}
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {item.label}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        currentStore?.value === item.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2  h-5 w-5" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
