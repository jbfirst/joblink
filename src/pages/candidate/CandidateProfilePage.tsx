import React, { useState, useEffect, useRef } from 'react';
import { useJob } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

const MAX_RESUME_SIZE_MB = 5;
const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const CandidateProfilePage: React.FC = () => {
  const { candidateProfile, updateCandidateProfile, uploadCandidateResume, uploadCandidateAvatar, getCandidateResumeUrl, isProfileLoading } = useJob();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState(candidateProfile.fullName);
  const [title, setTitle] = useState(candidateProfile.title);
  const [location, setLocation] = useState(candidateProfile.location);
  const [email, setEmail] = useState(candidateProfile.email);
  const [phone, setPhone] = useState(candidateProfile.phone);
  const [bio, setBio] = useState(candidateProfile.bio);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(candidateProfile.skills);

  // Synchronise les champs locaux dès que le vrai profil arrive depuis
  // Appwrite (au chargement, ou après connexion) — sauf en pleine édition,
  // pour ne pas écraser une saisie en cours.
  useEffect(() => {
    if (isEditing) return;
    setFullName(candidateProfile.fullName);
    setTitle(candidateProfile.title);
    setLocation(candidateProfile.location);
    setEmail(candidateProfile.email);
    setPhone(candidateProfile.phone);
    setBio(candidateProfile.bio);
    setSkills(candidateProfile.skills);
  }, [candidateProfile, isEditing]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCandidateProfile({
        fullName,
        title,
        location,
        email,
        phone,
        bio,
        skills
      });
      setIsEditing(false);
      showToast('Profil mis à jour', 'Vos modifications ont été enregistrées avec succès.', 'success');
    } catch (error) {
      showToast('Erreur', 'Impossible d\'enregistrer votre profil. Réessayez.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleResumeButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permet de re-sélectionner le même fichier plus tard
    if (!file) return;

    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      showToast('Format non supporté', 'Merci d\'envoyer un fichier PDF ou Word (.doc, .docx).', 'warning');
      return;
    }
    if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
      showToast('Fichier trop volumineux', `Votre CV doit faire moins de ${MAX_RESUME_SIZE_MB} Mo.`, 'warning');
      return;
    }

    setIsUploadingResume(true);
    try {
      await uploadCandidateResume(file);
      showToast('CV mis à jour', 'Votre nouveau CV a bien été enregistré.', 'success');
    } catch (error) {
      console.error('Erreur envoi CV :', error);
      showToast('Erreur', 'Impossible d\'envoyer votre CV. Réessayez.', 'error');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDownloadResume = () => {
    const url = getCandidateResumeUrl();
    if (!url) {
      showToast('Aucun CV', 'Vous n\'avez pas encore ajouté de CV.', 'warning');
      return;
    }
    window.open(url, '_blank');
  };

  const handleAvatarButtonClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Format non supporté', 'Merci de choisir une image (JPG, PNG...).', 'warning');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('Fichier trop volumineux', 'Votre photo doit faire moins de 3 Mo.', 'warning');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await uploadCandidateAvatar(file);
      showToast('Photo mise à jour', 'Votre photo de profil a bien été modifiée.', 'success');
    } catch (error) {
      console.error('Erreur envoi photo :', error);
      showToast('Erreur', 'Impossible d\'envoyer votre photo. Réessayez.', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="max-w-4xl space-y-4">
        <p className="text-sm text-on-surface-variant">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header with Edit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">Mon Profil Professionnel</h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Gérez vos informations, votre CV et vos compétences visibles par les recruteurs.
          </p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">
              {isEditing ? 'close' : 'edit'}
            </span>
          }
        >
          {isEditing ? 'Annuler l\'édition' : 'Modifier mon profil'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Main Identity Card */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={candidateProfile.avatar}
                alt={candidateProfile.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/20 shadow-md"
              />
              {isEditing && (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAvatarButtonClick}
                    disabled={isUploadingAvatar}
                    title="Modifier la photo"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isUploadingAvatar ? 'hourglass_empty' : 'photo_camera'}
                    </span>
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Titre du poste"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary">{candidateProfile.fullName || 'Complétez votre nom'}</h2>
                  <p className="text-sm font-semibold text-secondary">{candidateProfile.title || 'Ajoutez un titre de poste'}</p>
                  <p className="text-xs text-on-surface-variant flex items-center justify-center sm:justify-start gap-1">
                    <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                    {candidateProfile.location}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
            {isEditing ? (
              <>
                <Input
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Téléphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Input
                  label="Ville, Pays"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                <div className="p-3 bg-surface-variant/20 rounded-xl">
                  <span className="text-[11px] text-on-surface-variant block">Email :</span>
                  <span className="text-xs font-bold text-primary">{candidateProfile.email}</span>
                </div>
                <div className="p-3 bg-surface-variant/20 rounded-xl">
                  <span className="text-[11px] text-on-surface-variant block">Téléphone (Togo) :</span>
                  <span className="text-xs font-bold text-primary">{candidateProfile.phone || 'Non renseigné'}</span>
                </div>
                <div className="p-3 bg-surface-variant/20 rounded-xl">
                  <span className="text-[11px] text-on-surface-variant block">Résidence :</span>
                  <span className="text-xs font-bold text-primary">{candidateProfile.location}</span>
                </div>
              </>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-primary block">
              À propos de moi / Biographie
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            ) : (
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                {candidateProfile.bio || 'Ajoutez une courte biographie pour vous présenter aux recruteurs.'}
              </p>
            )}
          </div>
        </section>

        {/* CV Document Box */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              Mon Curriculum Vitae (CV)
            </h3>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeFileChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-surface-variant/20 rounded-xl border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
                {candidateProfile.resumeName?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOC'}
              </div>
              <div>
                <p className="text-sm font-bold text-primary">
                  {candidateProfile.resumeName || 'Aucun CV envoyé pour le moment'}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {candidateProfile.resumeFileId
                    ? 'Prêt pour candidature en 1 clic'
                    : 'Ajoutez un CV pour postuler plus rapidement'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadResume}
                disabled={!candidateProfile.resumeFileId}
                leftIcon={<span className="material-symbols-outlined text-[16px]">download</span>}
              >
                Télécharger
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleResumeButtonClick}
                isLoading={isUploadingResume}
                leftIcon={<span className="material-symbols-outlined text-[16px]">upload</span>}
              >
                {candidateProfile.resumeFileId ? 'Remplacer' : 'Envoyer un CV'}
              </Button>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            Compétences techniques & professionnelles
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-error"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </span>
            ))}
            {skills.length === 0 && !isEditing && (
              <p className="text-xs text-on-surface-variant">Aucune compétence renseignée pour le moment.</p>
            )}
          </div>

          {isEditing && (
            <div className="pt-2">
              <Input
                placeholder="Ajouter une compétence et appuyer sur Entrée (Ex: Vue.js, Python, SEO...)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                leftIcon={<span className="material-symbols-outlined text-[16px]">add</span>}
              />
            </div>
          )}
        </section>

        {/* Experiences Timeline */}
        {candidateProfile.experiences.length > 0 && (
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">work_history</span>
              Expériences professionnelles
            </h3>

            <div className="space-y-6 border-l-2 border-primary/20 pl-4 ml-2">
              {candidateProfile.experiences.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-white" />
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-primary">{exp.role}</h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-secondary">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Languages */}
        {(candidateProfile.education.length > 0 || candidateProfile.languages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            {candidateProfile.education.length > 0 && (
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">school</span>
                  Formations & Diplômes
                </h3>
                <div className="space-y-3">
                  {candidateProfile.education.map((edu) => (
                    <div key={edu.id} className="p-3 bg-surface-variant/20 rounded-xl space-y-1">
                      <h4 className="text-xs font-bold text-primary">{edu.degree}</h4>
                      <p className="text-[11px] text-on-surface-variant">{edu.school} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {candidateProfile.languages.length > 0 && (
              <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">translate</span>
                  Langues maîtrisées
                </h3>
                <div className="space-y-2.5">
                  {candidateProfile.languages.map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between p-2.5 bg-surface-variant/20 rounded-xl text-xs">
                      <span className="font-bold text-primary">{lang.name}</span>
                      <Badge variant="neutral" size="sm">{lang.level}</Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Save button if editing */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Button variant="ghost" type="button" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              Enregistrer les modifications
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
