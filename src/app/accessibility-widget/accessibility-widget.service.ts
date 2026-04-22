import { Injectable, OnDestroy } from '@angular/core';

export interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  contentScale: number;
  columnWidth: number;
  textAlign: string;
  language: string;
  readingMask: boolean;
  highContrast: boolean;
  darkMode: boolean;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  hideImages: boolean;
  highlightHeadings: boolean;
  textMagnifier: boolean;
  focusOutline: boolean;
  reduceMotion: boolean;
  cursorSize: boolean;
  stopAutoplay: boolean;
  invertColors: boolean;
  [key: string]: string | number | boolean;
}

export interface Translations {
  title: string;
  readingMask: string;
  highContrast: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  contentScale: string;
  dyslexiaFont: string;
  textAlign: string;
  textAlignCenter: string;
  textAlignLeft: string;
  highlightLinks: string;
  hideImages: string;
  highlightHeadings: string;
  textMagnifier: string;
  reset: string;
  poweredBy: string;
  darkMode: string;
  focusOutline: string;
  reduceMotion: string;
  cursorSize: string;
  stopAutoplay: string;
  invertColors: string;
  columnWidth: string;
  [key: string]: string;
}

const STORAGE_KEY = 'djalil-web-acc-widget-settings';

const TRANSLATIONS: Record<string, Translations> = {
  ar: {
    title: 'إمكانية الوصول',
    readingMask: 'قناع القراءة',
    highContrast: 'تباين عالٍ',
    fontSize: 'حجم الخط',
    lineHeight: 'ارتفاع السطر',
    letterSpacing: 'تباعد الأحرف',
    contentScale: 'تحجيم المحتوى',
    dyslexiaFont: 'خط مقروء',
    textAlign: 'محاذاة لليمين',
    textAlignCenter: 'توسيط',
    textAlignLeft: 'محاذاة لليسار',
    highlightLinks: 'تسطير الروابط',
    hideImages: 'إخفاء الصور',
    highlightHeadings: 'تمييز العناوين',
    textMagnifier: 'مساعد القراءة بالمؤشر',
    reset: 'إعادة تعيين',
    poweredBy: 'مدعوم من',
    darkMode: 'الوضع الداكن',
    focusOutline: 'إظهار إطار التركيز',
    reduceMotion: 'تقليل الحركة',
    cursorSize: 'تكبير المؤشر',
    stopAutoplay: 'إيقاف التشغيل التلقائي',
    invertColors: 'عكس الألوان',
    columnWidth: 'عرض العمود',
  },
  en: {
    title: 'Accessibility',
    readingMask: 'Reading Mask',
    highContrast: 'High Contrast',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',
    letterSpacing: 'Letter Spacing',
    contentScale: 'Content Scale',
    dyslexiaFont: 'Readable Font',
    textAlign: 'Align Right',
    textAlignCenter: 'Center',
    textAlignLeft: 'Align Left',
    highlightLinks: 'Underline Links',
    hideImages: 'Hide Images',
    highlightHeadings: 'Highlight Titles',
    textMagnifier: 'Cursor Reading Aid',
    reset: 'Reset',
    poweredBy: 'Powered by',
    darkMode: 'Dark Mode',
    focusOutline: 'Show Focus Outline',
    reduceMotion: 'Reduce Motion',
    cursorSize: 'Large Cursor',
    stopAutoplay: 'Stop Autoplay',
    invertColors: 'Invert Colors',
    columnWidth: 'Column Width',
  },
};

@Injectable({ providedIn: 'root' })
export class AccessibilityWidgetService implements OnDestroy {
  settings: AccessibilitySettings;
  currentLang: string;
  translations: Translations;

  private dynamicStyleEl: HTMLStyleElement | null = null;

  constructor() {
    this.settings = this.loadSettings();
    this.currentLang = this.settings.language || 'en';
    this.translations = TRANSLATIONS[this.currentLang];
  }

  ngOnDestroy(): void {
    this.removeDynamicFontSizeCSS();
    this.removeBodyClasses();
  }

  getDefaultSettings(): AccessibilitySettings {
    return {
      fontSize: 100,
      lineHeight: 100,
      letterSpacing: 100,
      contentScale: 100,
      columnWidth: 600,
      textAlign: 'default',
      language: 'en',
      readingMask: false,
      highContrast: false,
      darkMode: false,
      dyslexiaFont: false,
      highlightLinks: false,
      hideImages: false,
      highlightHeadings: false,
      textMagnifier: false,
      focusOutline: false,
      reduceMotion: false,
      cursorSize: false,
      stopAutoplay: false,
      invertColors: false,
    };
  }

  loadSettings(): AccessibilitySettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load accessibility settings:', e);
    }
    return this.getDefaultSettings();
  }

  saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save accessibility settings:', e);
    }
  }

  changeLanguage(lang: string): void {
    this.currentLang = lang;
    this.translations = TRANSLATIONS[lang];
    this.settings.language = lang;
    this.saveSettings();
  }

  toggleFeature(feature: string): void {
    if (feature.startsWith('textAlign')) {
      const align = feature.replace('textAlign', '').toLowerCase();
      if (this.settings.textAlign === align) {
        this.settings.textAlign = 'default';
      } else {
        this.settings.textAlign = align;
      }
    } else {
      this.settings[feature] = !this.settings[feature];
    }
    this.applySettings();
    this.saveSettings();
  }

  isFeatureActive(feature: string): boolean {
    if (feature.startsWith('textAlign')) {
      const align = feature.replace('textAlign', '').toLowerCase();
      return this.settings.textAlign === align;
    }
    return !!this.settings[feature];
  }

  updateSlider(id: string, value: number): void {
    this.settings[id] = value;
    this.applySettings();
    this.saveSettings();
  }

  resetSettings(): void {
    const lang = this.currentLang;
    this.settings = this.getDefaultSettings();
    this.settings.language = lang;
    this.removeDynamicFontSizeCSS();
    this.applySettings();
    this.saveSettings();
  }

  applySettings(): void {
    const body = document.body;
    const html = document.documentElement;

    // Remove all feature classes
    body.classList.remove(
      'djalil-web-acc-dyslexia',
      'djalil-web-acc-highlight-links',
      'djalil-web-acc-hide-images',
      'djalil-web-acc-highlight-headings',
      'djalil-web-acc-reading-mask',
      'djalil-web-acc-text-magnifier',
      'djalil-web-acc-high-contrast',
      'djalil-web-acc-dark-mode',
      'djalil-web-acc-focus-outline',
      'djalil-web-acc-reduce-motion',
      'djalil-web-acc-cursor-size',
      'djalil-web-acc-stop-autoplay',
    );

    // Clear inline styles
    html.style.fontSize = '';
    body.style.lineHeight = '';
    body.style.letterSpacing = '';
    body.style.zoom = '';

    // Apply font size
    if (this.settings.fontSize && this.settings.fontSize !== 100) {
      const pct = this.settings.fontSize + '%';
      html.style.setProperty('font-size', pct, 'important');
      body.style.setProperty('font-size', pct, 'important');
      this.injectDynamicFontSizeCSS(this.settings.fontSize);
    } else {
      this.removeDynamicFontSizeCSS();
    }

    // Line height
    if (this.settings.lineHeight && this.settings.lineHeight !== 100) {
      const val = (this.settings.lineHeight / 100).toString();
      body.style.setProperty('line-height', val, 'important');
    }

    // Letter spacing
    if (this.settings.letterSpacing && this.settings.letterSpacing !== 100) {
      const val = (this.settings.letterSpacing - 100) * 0.05 + 'em';
      body.style.setProperty('letter-spacing', val, 'important');
    }

    // Content scale
    if (this.settings.contentScale && this.settings.contentScale !== 100) {
      body.style.zoom = this.settings.contentScale + '%';
    }

    // Text alignment
    if (this.settings.textAlign && this.settings.textAlign !== 'default') {
      body.style.setProperty('text-align', this.settings.textAlign, 'important');
    }

    // Boolean feature classes
    if (this.settings.dyslexiaFont) body.classList.add('djalil-web-acc-dyslexia');
    if (this.settings.highlightLinks) body.classList.add('djalil-web-acc-highlight-links');
    if (this.settings.hideImages) body.classList.add('djalil-web-acc-hide-images');
    if (this.settings.highlightHeadings) body.classList.add('djalil-web-acc-highlight-headings');
    if (this.settings.readingMask) body.classList.add('djalil-web-acc-reading-mask');
    if (this.settings.textMagnifier) body.classList.add('djalil-web-acc-text-magnifier');
    if (this.settings.highContrast) body.classList.add('djalil-web-acc-high-contrast');
    if (this.settings.darkMode) body.classList.add('djalil-web-acc-dark-mode');
    if (this.settings.focusOutline) body.classList.add('djalil-web-acc-focus-outline');
    if (this.settings.reduceMotion) body.classList.add('djalil-web-acc-reduce-motion');
    if (this.settings.cursorSize) body.classList.add('djalil-web-acc-cursor-size');
    if (this.settings.stopAutoplay) {
      body.classList.add('djalil-web-acc-stop-autoplay');
      document.querySelectorAll('video[autoplay], audio[autoplay]').forEach((media) => {
        (media as HTMLMediaElement).pause();
        media.removeAttribute('autoplay');
      });
    }

    // Invert colors
    if (this.settings.invertColors) {
      html.classList.add('djalil-web-acc-invert');
    } else {
      html.classList.remove('djalil-web-acc-invert');
    }
  }

  private injectDynamicFontSizeCSS(fontSize: number): void {
    this.removeDynamicFontSizeCSS();
    const style = document.createElement('style');
    style.id = 'djalil-web-acc-dynamic-fontsize';
    style.textContent = `
      p, div, li, td, th, article, section, span, a {
        font-size: ${fontSize}% !important;
      }
    `;
    document.head.appendChild(style);
    this.dynamicStyleEl = style;
  }

  private removeDynamicFontSizeCSS(): void {
    if (this.dynamicStyleEl) {
      this.dynamicStyleEl.remove();
      this.dynamicStyleEl = null;
    }
    document.getElementById('djalil-web-acc-dynamic-fontsize')?.remove();
  }

  private removeBodyClasses(): void {
    document.body.classList.remove(
      'djalil-web-acc-dyslexia',
      'djalil-web-acc-highlight-links',
      'djalil-web-acc-hide-images',
      'djalil-web-acc-highlight-headings',
      'djalil-web-acc-reading-mask',
      'djalil-web-acc-text-magnifier',
      'djalil-web-acc-high-contrast',
      'djalil-web-acc-dark-mode',
      'djalil-web-acc-focus-outline',
      'djalil-web-acc-reduce-motion',
      'djalil-web-acc-cursor-size',
      'djalil-web-acc-stop-autoplay',
    );
    document.documentElement.classList.remove('djalil-web-acc-invert');
  }
}
