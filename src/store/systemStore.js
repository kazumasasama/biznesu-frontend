import { defineStore } from "pinia";

export const useSystemStore = defineStore("systemStore", {
  state() {
    return {
      isLoading: false,
      LoadingMessage: '',
      mapboxURL: 'mapbox://styles/mapbox/streets-v11',
      calendarLocale: 'en',
      business: null,
      config: null,
      businessTimes: null,
    };
  },
  actions: {
    initBusiness(business) {
      this.business = business;
    },
    initBusinessTimes(business) {
      this.businessTimes = business;
    },
    initConfig(config) {
      this.config = config;
      // this.calendarLocale = config.lang;
    },
    startLoading() {
      this.isLoading = true;
    },
    endLoading() {
      this.isLoading = false;
    },
    modifyLoadingMessage(message) {
      this.LoadingMessage = message
    },
    changeAppLocale(lang) {
      if (lang === 'en') {
        this.mapboxURL = 'mapbox://styles/mapbox/streets-v11'
      } else if (lang === 'ja') {
        this.mapboxURL = 'mapbox://styles/kaznyc/cl3z0c148000i14qp3onp4x8e'
      }
      this.calendarLocale = lang;
    },
  },
});