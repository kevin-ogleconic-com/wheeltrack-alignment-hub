
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AuditLogEntry {
  action: string;
  details: Record<string, any>;
  timestamp: Date;
}

export const useSecurityAudit = () => {
  const { user, userRole } = useAuth();

  const logSecurityEvent = async (action: string, details: Record<string, any> = {}) => {
    if (!user) return;

    const auditEntry: AuditLogEntry = {
      action,
      details: {
        ...details,
        user_id: user.id,
        user_email: user.email,
        user_role: userRole,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        ip_address: 'client-side' // Would need server-side for real IP
      },
      timestamp: new Date()
    };

    // Log to console for development (in production, send to secure logging service)
    console.log('Security Audit Log:', auditEntry);

    // For admin actions, also log to database if needed
    if (userRole === 'admin' && ['role_change', 'data_access', 'user_management'].includes(action)) {
      try {
        // This would typically go to a dedicated audit log table
        console.log('High-privilege action logged:', auditEntry);
      } catch (error) {
        console.error('Failed to log security event:', error);
      }
    }
  };

  const logDataAccess = (table: string, action: 'read' | 'write' | 'delete', recordId?: string) => {
    logSecurityEvent('data_access', {
      table,
      action,
      record_id: recordId
    });
  };

  const logAuthenticationEvent = (event: 'login' | 'logout' | 'failed_login', details?: Record<string, any>) => {
    logSecurityEvent('authentication', {
      event,
      ...details
    });
  };

  const logRoleChange = (targetUserId: string, oldRole: string, newRole: string) => {
    logSecurityEvent('role_change', {
      target_user_id: targetUserId,
      old_role: oldRole,
      new_role: newRole
    });
  };

  return {
    logSecurityEvent,
    logDataAccess,
    logAuthenticationEvent,
    logRoleChange
  };
};
