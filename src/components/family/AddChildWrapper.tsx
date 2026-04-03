'use client';

import { useRouter } from 'next/navigation';
import { AddChildForm } from './AddChildForm';

type Props = {
  familyId: string;
  inviteCode: string;
};

export function AddChildWrapper({ familyId, inviteCode }: Props) {
  const router = useRouter();

  return (
    <AddChildForm
      familyId={familyId}
      inviteCode={inviteCode}
      onAdded={() => {
        router.push('/family/members');
        router.refresh();
      }}
      onCancel={() => router.back()}
    />
  );
}
