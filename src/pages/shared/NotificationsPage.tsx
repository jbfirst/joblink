import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Tabs } from '../../components/common/Tabs';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  // Recharge les notifications à chaque ouverture de la page (elles
  // peuvent avoir été créées par une autre personne depuis la connexion)
  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: 'all', label: 'Toutes', count: notifications.length },
    { id: 'unread', label: 'Non lues', count: notifications.filter((n) => !n.read).length },
    { id: 'interview', label: 'Entretiens', count: notifications.filter((n) => n.type === 'interview').length },
    { id: 'application', label: 'Candidatures', count: notifications.filter((n) => n.type === 'application').length },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <span className="material-symbols-outlined text-secondary">event_available</span>;
      case 'application':
        return <span className="material-symbols-outlined text-primary">assignment_turned_in</span>;
      case 'job_alert':
        return <span className="material-symbols-outlined text-amber-600">work</span>;
      default:
        return <span className="material-symbols-outlined text-outline">notifications</span>;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Centre de Notifications</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Restez informé de l'avancement de vos recrutements et candidatures.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllAsRead}
          leftIcon={<span className="material-symbols-outlined text-[16px]">done_all</span>}
        >
          Tout marquer comme lu
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          title="Aucune notification"
          description="Vous êtes à jour ! Aucune nouvelle notification pour le moment."
          iconName="notifications_off"
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read
                  ? 'bg-surface-container-lowest border-primary/25 shadow-soft ring-1 ring-primary/10'
                  : 'bg-surface-container-lowest/70 border-outline-variant/30 opacity-80 hover:opacity-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  !notif.read ? 'bg-secondary-container/40' : 'bg-surface-variant/40'
                }`}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={`text-sm font-bold truncate ${
                      !notif.read ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary mt-2 hover:underline">
                    Consulter <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                )}
              </div>

              {!notif.read && (
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
