'use client';

import React, { useEffect, useState } from 'react';
import Modal from '../modal';
import { Button } from '../ui/button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action  cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={onConfirm} disabled={loading} variant={'destructive'}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
