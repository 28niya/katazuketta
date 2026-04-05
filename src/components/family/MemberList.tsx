import { USER_ROLES, AUTH_TYPES } from '@/types';

type Member = {
  id: string;
  name: string;
  role: string;
  authType: string;
  avatarColor: string | null;
  avatarIcon: string;
};

type Props = {
  members: Member[];
  currentUserId: string;
};

export function MemberList({ members, currentUserId }: Props) {
  return (
    <ul className="flex flex-col gap-3">
      {members.map((member) => (
        <li key={member.id} className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: member.avatarColor ?? '#4a5568' }}
          >
            <i className={`bx ${member.avatarIcon} text-lg text-white`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate">{member.name}</span>
              {member.id === currentUserId && (
                <span className="text-xs text-sub">あなた</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-sub">
              {member.role === USER_ROLES.ADMIN && (
                <span className="text-green-accent font-bold">管理者</span>
              )}
              {member.authType === AUTH_TYPES.CHILD_PIN && (
                <span>子どもアカウント</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
