'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button, BUTTON_VARIANTS } from '@/components/ui/Button';
import { USER_ROLES } from '@/types';
import { MemberList } from './MemberList';
import { InviteCode } from './InviteCode';
import { AddChildForm } from './AddChildForm';

type Family = {
  id: string;
  name: string;
  inviteCode: string;
};

type User = {
  id: string;
  name: string;
  role: string;
  authType: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Props = {
  family: Family;
  members: User[];
  currentUser: User;
};

export function MembersPageClient({ family, members: initialMembers, currentUser }: Props) {
  const [members, setMembers] = useState(initialMembers);
  const [showAddChild, setShowAddChild] = useState(false);
  const isAdmin = currentUser.role === USER_ROLES.ADMIN;

  return (
    <>
      <GlassCard>
        <MemberList members={members} currentUserId={currentUser.id} />
      </GlassCard>

      <InviteCode code={family.inviteCode} />

      {isAdmin && (
        showAddChild ? (
          <GlassCard>
            <h2 className="font-bold mb-4">子どもアカウントを追加</h2>
            <AddChildForm
              familyId={family.id}
              inviteCode={family.inviteCode}
              onAdded={(child) => {
                setMembers((prev) => [...prev, child]);
                setShowAddChild(false);
              }}
              onCancel={() => setShowAddChild(false)}
            />
          </GlassCard>
        ) : (
          <Button
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={() => setShowAddChild(true)}
            className="self-center"
          >
            <i className="bx bx-plus text-lg" />
            子どもアカウントを追加
          </Button>
        )
      )}
    </>
  );
}
