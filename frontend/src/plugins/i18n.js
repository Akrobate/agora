import Vue from 'vue';
import VueI18n from 'vue-i18n';
// import configuration from '@/configurations';

Vue.use(VueI18n);

export default new VueI18n({
  locale: 'fr',
  fallbackLocale: 'fr',
});
