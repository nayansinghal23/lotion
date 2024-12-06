import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { settingsHindi } from "./hi/settings";
import { settingsFrench } from "./fr/settings";
import { settingsEnglish } from "./en/settings";
import { paymentSuccessEnglish } from "./en/payment-success";
import { paymentSuccessFrench } from "./fr/payment-success";
import { paymentSuccessHindi } from "./hi/payment-success";
import { paymentCancelEnglish } from "./en/payment-cancel";
import { paymentCancelFrench } from "./fr/payment-cancel";
import { paymentCancelHindi } from "./hi/payment-cancel";
import { marketingEnglish } from "./en/marketing";
import { marketingFrench } from "./fr/marketing";
import { marketingHindi } from "./hi/marketing";
import { notificationsEnglish } from "./en/notifications";
import { notificationsFrench } from "./fr/notifications";
import { notificationsHindi } from "./hi/notifications";
import { documentsEnglish } from "./en/documents";
import { documentsFrench } from "./fr/documents";
import { documentsHindi } from "./hi/documents";
import { navigationEnglish } from "./en/navigation";
import { navigationFrench } from "./fr/navigation";
import { navigationHindi } from "./hi/navigation";
import { documentIdEnglish } from "./en/documentId";
import { documentIdFrench } from "./fr/documentId";
import { documentIdHindi } from "./hi/documentId";
import { chartEnglish } from "./en/chart";
import { chartFrench } from "./fr/chart";
import { chartHindi } from "./hi/chart";
import { meetingEnglish } from "./en/meeting";
import { meetingFrench } from "./fr/meeting";
import { meetingHindi } from "./hi/meeting";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === "development",
    fallbackLng: "en",
    returnObjects: true,
    resources: {
      en: {
        translation: {
          settings: settingsEnglish,
          paymentSuccess: paymentSuccessEnglish,
          paymentCancel: paymentCancelEnglish,
          marketing: marketingEnglish,
          notifications: notificationsEnglish,
          documents: documentsEnglish,
          navigation: navigationEnglish,
          documentId: documentIdEnglish,
          chart: chartEnglish,
          meeting: meetingEnglish,
        },
      },
      fr: {
        translation: {
          settings: settingsFrench,
          paymentSuccess: paymentSuccessFrench,
          paymentCancel: paymentCancelFrench,
          marketing: marketingFrench,
          notifications: notificationsFrench,
          documents: documentsFrench,
          navigation: navigationFrench,
          documentId: documentIdFrench,
          chart: chartFrench,
          meeting: meetingFrench,
        },
      },
      hi: {
        translation: {
          settings: settingsHindi,
          paymentSuccess: paymentSuccessHindi,
          paymentCancel: paymentCancelHindi,
          marketing: marketingHindi,
          notifications: notificationsHindi,
          documents: documentsHindi,
          navigation: navigationHindi,
          documentId: documentIdHindi,
          chart: chartHindi,
          meeting: meetingHindi,
        },
      },
    },
  });
