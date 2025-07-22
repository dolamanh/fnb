// Presentation Layer - i18n Hooks for UI Components

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

// Type-safe translation hook
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  
  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
  }, [i18n]);
  
  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);
  
  const getAvailableLanguages = useCallback(() => {
    return ['en', 'vi'];
  }, []);
  
  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isLoading: !i18n.isInitialized,
  };
};

// Specific hooks for different domains
export const useUserTranslation = () => {
  const { t } = useTranslation();
  
  return {
    title: t('users.title'),
    addUser: t('users.addUser'),
    editUser: t('users.editUser'),
    deleteUser: t('users.deleteUser'),
    userList: t('users.userList'),
    noUsers: t('users.noUsers'),
    createFirstUser: t('users.createFirstUser'),
    userCreated: t('users.userCreated'),
    userUpdated: t('users.userUpdated'),
    userDeleted: t('users.userDeleted'),
    confirmDelete: t('users.confirmDelete'),
    form: {
      name: t('users.form.name'),
      email: t('users.form.email'),
      phone: t('users.form.phone'),
      namePlaceholder: t('users.form.namePlaceholder'),
      emailPlaceholder: t('users.form.emailPlaceholder'),
      phonePlaceholder: t('users.form.phonePlaceholder'),
      nameRequired: t('users.form.nameRequired'),
      emailRequired: t('users.form.emailRequired'),
      emailInvalid: t('users.form.emailInvalid'),
      phoneInvalid: t('users.form.phoneInvalid'),
    },
  };
};

export const useCommonTranslation = () => {
  const { t } = useTranslation();
  
  return {
    loading: t('common.loading'),
    error: t('common.error'),
    retry: t('common.retry'),
    cancel: t('common.cancel'),
    save: t('common.save'),
    delete: t('common.delete'),
    edit: t('common.edit'),
    add: t('common.add'),
    confirm: t('common.confirm'),
    back: t('common.back'),
    next: t('common.next'),
    previous: t('common.previous'),
    search: t('common.search'),
    filter: t('common.filter'),
    clear: t('common.clear'),
    refresh: t('common.refresh'),
    success: t('common.success'),
    warning: t('common.warning'),
    info: t('common.info'),
    yes: t('common.yes'),
    no: t('common.no'),
  };
};

export const useErrorTranslation = () => {
  const { t } = useTranslation();
  
  return {
    networkError: t('errors.networkError'),
    serverError: t('errors.serverError'),
    unknownError: t('errors.unknownError'),
    validationError: t('errors.validationError'),
    notFound: t('errors.notFound'),
    unauthorized: t('errors.unauthorized'),
    timeout: t('errors.timeout'),
  };
};
