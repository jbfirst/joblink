import React, { useState, useEffect, useRef } from 'react';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const RecruiterCompanyProfilePage: React.FC = () => {
  const { recruiterCompany, updateRecruiterCompany, uploadCompanyLogo, uploadCompanyBanner, isCompanyLoading } = useJob();
  const { showToast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('Lomé');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [size, setSize] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [about, setAbout] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    if (!recruiterCompany || isEditing) return;
    setName(recruiterCompany.name);
    setTagline(recruiterCompany.tagline);
    setIndustry(recruiterCompany.industry);
    setLocation(recruiterCompany.location || 'Lomé');
    setAddress(recruiterCompany.address);
    setWebsite(recruiterCompany.website);
    setSize(recruiterCompany.size);
    setFoundedYear(recruiterCompany.foundedYear);
    setAbout(recruiterCompany.about);
    setValues(recruiterCompany.values || []);
  }, [recruiterCompany, isEditing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateRecruiterCompany({
        name,
        tagline,
        industry,
        location,
        address,
        website,
        size,
        foundedYear,
        about,
        values
      });
      setIsEditing(false);
      showToast('Fiche entreprise mise à jour', 'Vos modifications ont bien été enregistrées.', 'success');
    } catch (error) {
      showToast('Erreur', 'Impossible d\'enregistrer la fiche entreprise. Réessayez.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddValue = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newValue.trim()) {
      e.preventDefault();
      if (!values.includes(newValue.trim())) {
        setValues([...values, newValue.trim()]);
      }
      setNewValue('');
    }
  };

  const handleImageUpload = async (
    file: File,
    uploader: (file: File) => Promise<void>,
    setLoading: (v: boolean) => void,
    label: string
  ) => {
    if (!file.type.startsWith('image/')) {
      showToast('Format non supporté', 'Merci de choisir une image (JPG, PNG...).', 'warning');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('Fichier trop volumineux', 'L\'image doit faire moins de 3 Mo.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await uploader(file);
      showToast(`${label} mis à jour`, `Votre ${label.toLowerCase()} a bien été modifié.`, 'success');
    } catch (error) {
      showToast('Erreur', `Impossible d'envoyer le ${label.toLowerCase()}. Réessayez.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isCompanyLoading || !recruiterCompany) {
    return (
      <div className="max-w-4xl space-y-4">
        <p className="text-sm text-on-surface-variant">Chargement de votre fiche entreprise...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Ma Fiche Entreprise</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Cette fiche est visible publiquement par les candidats sur JobLink Togo.
          </p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={<span className="material-symbols-outlined text-[18px]">{isEditing ? 'close' : 'edit'}</span>}
        >
          {isEditing ? 'Annuler' : 'Modifier ma fiche'}
        </Button>
      </div>

      {/* Banner + Logo */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="relative h-32 sm:h-40 bg-surface-variant/40">
          {recruiterCompany.banner && (
            <img src={recruiterCompany.banner} alt="Bannière" className="w-full h-full object-cover" />
          )}
          {isEditing && (
            <>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = '';
                  if (file) handleImageUpload(file, uploadCompanyBanner, setIsUploadingBanner, 'Bannière');
                }}
              />
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isUploadingBanner}
                className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/50 text-white text-xs font-semibold hover:bg-black/70 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isUploadingBanner ? 'hourglass_empty' : 'photo_camera'}
                </span>
                Changer la bannière
              </button>
            </>
          )}
        </div>

        <div className="p-6 pt-0 -mt-10 flex items-end gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-surface-container-lowest border-4 border-surface-container-lowest shadow-md overflow-hidden">
              {recruiterCompany.logo ? (
                <img src={recruiterCompany.logo} alt={recruiterCompany.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {recruiterCompany.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            {isEditing && (
              <>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (file) handleImageUpload(file, uploadCompanyLogo, setIsUploadingLogo, 'Logo');
                  }}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  title="Modifier le logo"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isUploadingLogo ? 'hourglass_empty' : 'photo_camera'}
                  </span>
                </button>
              </>
            )}
          </div>
          <div className="pb-1">
            <h2 className="text-lg font-bold text-primary">{recruiterCompany.name || 'Nom de l\'entreprise'}</h2>
            <p className="text-xs text-on-surface-variant">{recruiterCompany.tagline || 'Ajoutez un slogan'}</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Main Info */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-5">
          <h2 className="text-lg font-bold text-primary border-b border-outline-variant/20 pb-3">
            Informations générales
          </h2>

          {isEditing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nom de l'entreprise" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Slogan" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Ex: Bâtir l'avenir numérique du Togo" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Secteur / Industrie"
                  options={['Informatique & Technologies', 'Banque & Finance', 'Logistique & Transport', 'BTP & Construction', 'Agro-industrie', 'Santé & Médical']}
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <Select
                  label="Ville"
                  options={['Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Dapaong']}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Input label="Adresse complète" value={address} onChange={(e) => setAddress(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Site web" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
                <Input label="Taille de l'équipe" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Ex: 10-50 employés" />
                <Input label="Année de création" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="Ex: 2019" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary block">À propos</label>
                <textarea
                  rows={4}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Présentez votre entreprise, sa mission, sa culture..."
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-surface-variant/20 rounded-xl">
                <span className="text-on-surface-variant block">Secteur :</span>
                <span className="font-bold text-primary">{recruiterCompany.industry || 'Non renseigné'}</span>
              </div>
              <div className="p-3 bg-surface-variant/20 rounded-xl">
                <span className="text-on-surface-variant block">Ville :</span>
                <span className="font-bold text-primary">{recruiterCompany.location || 'Non renseigné'}</span>
              </div>
              <div className="p-3 bg-surface-variant/20 rounded-xl sm:col-span-2">
                <span className="text-on-surface-variant block">Adresse :</span>
                <span className="font-bold text-primary">{recruiterCompany.address || 'Non renseignée'}</span>
              </div>
              <div className="p-3 bg-surface-variant/20 rounded-xl">
                <span className="text-on-surface-variant block">Site web :</span>
                <span className="font-bold text-primary">{recruiterCompany.website || 'Non renseigné'}</span>
              </div>
              <div className="p-3 bg-surface-variant/20 rounded-xl">
                <span className="text-on-surface-variant block">Taille :</span>
                <span className="font-bold text-primary">{recruiterCompany.size || 'Non renseignée'}</span>
              </div>
              <div className="p-3 bg-surface-variant/20 rounded-xl sm:col-span-2">
                <span className="text-on-surface-variant block">À propos :</span>
                <p className="text-primary mt-1">{recruiterCompany.about || 'Aucune description pour le moment.'}</p>
              </div>
            </div>
          )}
        </section>

        {/* Values */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">favorite</span>
            Valeurs de l'entreprise
          </h3>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <span key={v} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">
                <span>{v}</span>
                {isEditing && (
                  <button type="button" onClick={() => setValues(values.filter((x) => x !== v))} className="hover:text-error">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </span>
            ))}
            {values.length === 0 && !isEditing && (
              <p className="text-xs text-on-surface-variant">Aucune valeur renseignée.</p>
            )}
          </div>
          {isEditing && (
            <Input
              placeholder="Ajouter une valeur et appuyer sur Entrée (Ex: Innovation, Intégrité...)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleAddValue}
              leftIcon={<span className="material-symbols-outlined text-[16px]">add</span>}
            />
          )}
        </section>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>Annuler</Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>Enregistrer les modifications</Button>
          </div>
        )}
      </form>
    </div>
  );
};
