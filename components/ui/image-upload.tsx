'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './button';
import { CalendarPlus, ImagePlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  multiple,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    console.log(result);
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((img) => (
          <div
            key={img}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button type="button" onClick={() => onRemove(img)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={img} />
          </div>
        ))}{' '}
        <CldUploadWidget
          options={{ multiple: multiple }}
          onUpload={onUpload}
          uploadPreset="airbnb"
        >
          {({ open }) => {
            const onClick = () => {
              open();
            };

            return (
              <Button
                type="button"
                disabled={disabled}
                variant="secondary"
                onClick={onClick}
              >
                <ImagePlusIcon className="h-4 w-4 mr-2" />
                Upload an image
              </Button>
            );
          }}
        </CldUploadWidget>
      </div>
    </div>
  );
};

export default ImageUpload;
