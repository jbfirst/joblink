import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const SettingsPage: React.FC = () => {
  const { user, changePassword } = useAuth();
  const { showToast } = useToast();

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [language, setLanguage] = useState('Français');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Paramètres enregistrés', 'Vos préférences ont été mises à jour avec succès.', 'success');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Champs requis', 'Veuillez saisir vos mots de passe.', 'warning');
      return;
    }
    if (newPassword.length < 8) {
      showToast('Mot de passe trop court', 'Le nouveau mot de passe doit contenir au moins 8 caractères.', 'warning');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(newPassword, currentPassword);
      setCurrentPassword('');
      setNewPassword('');
      showToast('Mot de passe modifié', 'Votre mot de passe a été mis à jour.', 'success');
    } catch (error: any) {
      console.error('Erreur changement mot de passe :', error);
      const message = error?.code === 401
        ? 'Mot de passe actuel incorrect.'
        : 'Impossible de modifier le mot de passe. Réessayez.';
      showToast('Erreur', message, 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Paramètres du Compte</h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Gérez vos préférences de notifications, alertes WhatsApp et sécurité.
        </p>
      </div>

      {/* Account Info */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
        <h2 className="text-base font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">account_circle</span>
          Informations du compte
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface-variant/20 rounded-xl">
            <span className="text-on-surface-variant block">Nom :</span>
            <span className="font-bold text-primary">{user?.name}</span>
          </div>
          <div className="p-3 bg-surface-variant/20 rounded-xl">
            <span className="text-on-surface-variant block">Email :</span>
            <span className="font-bold text-primary">{user?.email}</span>
          </div>
          <div className="p-3 bg-surface-variant/20 rounded-xl sm:col-span-2">
            <span className="text-on-surface-variant block">Type de compte :</span>
            <span className="font-bold text-primary">
              {user?.role === 'candidate' ? 'Candidat' : 'Recruteur'}
            </span>
          </div>
        </div>
      </section>

      {/* Notifications & Channels Preferences */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
        <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">notifications_active</span>
          Canaux d'alertes & Notifications au Togo
        </h2>

        <form onSubmit={handleSavePreferences} className="space-y-4">
          {/* WhatsApp */}
          <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <div>
                <h4 className="text-xs font-bold text-primary">Alertes WhatsApp instantanées</h4>
                <p className="text-[11px] text-on-surface-variant">
                  Recevez immédiatement les convocations d'entretien et alertes urgentes sur WhatsApp (+228).
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappAlerts}
              onChange={(e) => setWhatsappAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-secondary focus:ring-secondary"
            />
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 bg-surface-variant/20 border border-outline-variant/20 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">mail</span>
              <div>
                <h4 className="text-xs font-bold text-primary">Notifications par Email</h4>
                <p className="text-[11px] text-on-surface-variant">
                  Récapitulatif hebdomadaire des offres et confirmation de candidatures.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary"
            />
          </div>

          {/* SMS */}
          <div className="flex items-center justify-between p-4 bg-surface-variant/20 border border-outline-variant/20 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">sms</span>
              <div>
                <h4 className="text-xs font-bold text-primary">Alertes SMS Togo (T-Money / Moov / Togocom)</h4>
                <p className="text-[11px] text-on-surface-variant">
                  Notification par SMS en cas de réponse d'un recruteur.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-primary focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Enregistrer les préférences
            </Button>
          </div>
        </form>
      </section>

      {/* Language & Regional */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
        <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">language</span>
          Langue & Fuseau horaire
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Langue de l'interface"
            options={['Français', 'English']}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <Select
            label="Fuseau horaire"
            options={['Lomé (GMT+0)', 'Paris (GMT+1 / GMT+2)', 'Abidjan (GMT+0)']}
            value="Lomé (GMT+0)"
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Security & Password */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
        <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">lock</span>
          Sécurité & Mot de passe
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="Nouveau mot de passe"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="outline" size="sm" isLoading={isChangingPassword}>
              Mettre à jour le mot de passe
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};
