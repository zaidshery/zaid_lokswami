import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArticleStatus, statusLabels, UserRole } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

interface StatusChangerProps {
  currentStatus: ArticleStatus;
  onChange: (status: ArticleStatus) => void;
}

// Define which roles can change to which status
const statusPermissions: Record<ArticleStatus, UserRole[]> = {
  [ArticleStatus.DRAFT]: [UserRole.REPORTER, UserRole.SUB_EDITOR, UserRole.EDITOR, UserRole.ADMIN],
  [ArticleStatus.SUB_EDITOR_REVIEW]: [UserRole.REPORTER, UserRole.SUB_EDITOR, UserRole.EDITOR, UserRole.ADMIN],
  [ArticleStatus.EDITOR_APPROVED]: [UserRole.SUB_EDITOR, UserRole.EDITOR, UserRole.ADMIN],
  [ArticleStatus.PUBLISHED]: [UserRole.EDITOR, UserRole.ADMIN],
  [ArticleStatus.ARCHIVED]: [UserRole.EDITOR, UserRole.ADMIN]
};

const statusFlow: Record<ArticleStatus, ArticleStatus[]> = {
  [ArticleStatus.DRAFT]: [ArticleStatus.SUB_EDITOR_REVIEW],
  [ArticleStatus.SUB_EDITOR_REVIEW]: [ArticleStatus.DRAFT, ArticleStatus.EDITOR_APPROVED],
  [ArticleStatus.EDITOR_APPROVED]: [ArticleStatus.DRAFT, ArticleStatus.PUBLISHED],
  [ArticleStatus.PUBLISHED]: [ArticleStatus.ARCHIVED, ArticleStatus.DRAFT],
  [ArticleStatus.ARCHIVED]: [ArticleStatus.DRAFT]
};

export function StatusChanger({ currentStatus, onChange }: StatusChangerProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  // Get allowed next statuses based on current status
  const allowedNextStatuses = statusFlow[currentStatus] || [];
  
  // Filter based on user role permissions
  const availableStatuses = allowedNextStatuses.filter(status => 
    statusPermissions[status].includes(user.role)
  );

  // If no status changes available, don't show the dropdown
  if (availableStatuses.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          स्थिति बदलें
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => {
              onChange(status);
              setIsOpen(false);
            }}
            className="font-hindi"
          >
            {statusLabels[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}