import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilityWidgetService } from './accessibility-widget.service';

type WidgetLanguage = 'ar' | 'en';
type WidgetLanguageOption = WidgetLanguage | 'app';

interface FeatureCard {
  id: string;
  icon: string;
  labelKey: string;
}

interface SliderConfig {
  id: string;
  labelKey: string;
  min: number;
  max: number;
  step: number;
  suffix: string;
}

@Component({
  selector: 'app-accessibility-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessibility-widget.component.html',
  styleUrl: './accessibility-widget.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AccessibilityWidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() lang?: WidgetLanguage;
  selectedLanguageOption: WidgetLanguageOption = 'en';

  isOpen = false;
  private readingMaskEl: HTMLDivElement | null = null;
  private magnifierEl: HTMLDivElement | null = null;
  private magnifierTimeout: ReturnType<typeof setTimeout> | null = null;
  private boundMouseMove = this.onMouseMove.bind(this);

  features: FeatureCard[] = [
    { id: 'readingMask', icon: 'fa-eye', labelKey: 'readingMask' },
    { id: 'highContrast', icon: 'fa-adjust', labelKey: 'highContrast' },
    { id: 'darkMode', icon: 'fa-moon', labelKey: 'darkMode' },
    { id: 'dyslexiaFont', icon: 'fa-font', labelKey: 'dyslexiaFont' },
    { id: 'textAlignRight', icon: 'fa-align-right', labelKey: 'textAlign' },
    { id: 'textAlignCenter', icon: 'fa-align-center', labelKey: 'textAlignCenter' },
    { id: 'textAlignLeft', icon: 'fa-align-left', labelKey: 'textAlignLeft' },
    { id: 'highlightLinks', icon: 'fa-link', labelKey: 'highlightLinks' },
    { id: 'hideImages', icon: 'fa-image', labelKey: 'hideImages' },
    { id: 'highlightHeadings', icon: 'fa-heading', labelKey: 'highlightHeadings' },
    { id: 'textMagnifier', icon: 'fa-search-plus', labelKey: 'textMagnifier' },
    { id: 'focusOutline', icon: 'fa-square', labelKey: 'focusOutline' },
    { id: 'reduceMotion', icon: 'fa-pause', labelKey: 'reduceMotion' },
    { id: 'cursorSize', icon: 'fa-mouse-pointer', labelKey: 'cursorSize' },
    { id: 'stopAutoplay', icon: 'fa-stop', labelKey: 'stopAutoplay' },
    { id: 'invertColors', icon: 'fa-exchange-alt', labelKey: 'invertColors' },
  ];

  sliders: SliderConfig[] = [
    { id: 'fontSize', labelKey: 'fontSize', min: 80, max: 150, step: 1, suffix: '%' },
    { id: 'lineHeight', labelKey: 'lineHeight', min: 100, max: 200, step: 1, suffix: '%' },
    { id: 'letterSpacing', labelKey: 'letterSpacing', min: 100, max: 150, step: 1, suffix: '%' },
    { id: 'contentScale', labelKey: 'contentScale', min: 80, max: 130, step: 1, suffix: '%' },
    {
      id: 'columnWidth',
      labelKey: 'columnWidth',
      min: 400,
      max: window.innerWidth,
      step: 50,
      suffix: 'px',
    },
  ];

  constructor(public djalilWebAcc: AccessibilityWidgetService) {}

  ngOnInit(): void {
    this.selectedLanguageOption = this.djalilWebAcc.currentLang === 'ar' ? 'ar' : 'en';
    this.applyInputLanguage(true);
    this.createReadingMask();
    this.createMagnifier();
    this.djalilWebAcc.applySettings();
    document.addEventListener('mousemove', this.boundMouseMove);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lang']) {
      this.applyInputLanguage();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.boundMouseMove);
    this.readingMaskEl?.remove();
    this.magnifierEl?.remove();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  toggleFeature(featureId: string): void {
    this.djalilWebAcc.toggleFeature(featureId);
  }

  isFeatureActive(featureId: string): boolean {
    return this.djalilWebAcc.isFeatureActive(featureId);
  }

  changeLanguage(lang: string): void {
    if (lang === 'app') {
      this.selectedLanguageOption = 'app';
      this.applyInputLanguage(true);
      return;
    }

    if (lang === 'ar' || lang === 'en') {
      this.selectedLanguageOption = lang;
      this.djalilWebAcc.changeLanguage(lang);
    }
  }

  onSliderInput(id: string, event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    this.djalilWebAcc.updateSlider(id, value);
  }

  adjustSlider(id: string, direction: 'increase' | 'decrease'): void {
    const slider = this.sliders.find((s) => s.id === id);
    if (!slider) return;
    const current =
      (this.djalilWebAcc.settings[id] as number) || (id === 'columnWidth' ? 600 : 100);
    const step = slider.step;
    let newVal: number;
    if (direction === 'increase') {
      newVal = Math.min(current + step, slider.max);
    } else {
      newVal = Math.max(current - step, slider.min);
    }
    this.djalilWebAcc.updateSlider(id, newVal);
  }

  getSliderValue(id: string): number {
    return (this.djalilWebAcc.settings[id] as number) || (id === 'columnWidth' ? 600 : 100);
  }

  getSliderDisplay(id: string): string {
    const slider = this.sliders.find((s) => s.id === id);
    return this.getSliderValue(id) + (slider?.suffix || '%');
  }

  resetSettings(): void {
    this.djalilWebAcc.resetSettings();
  }

  get t() {
    return this.djalilWebAcc.translations;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

  private createReadingMask(): void {
    if (!document.getElementById('djalil-web-acc-reading-mask')) {
      this.readingMaskEl = document.createElement('div');
      this.readingMaskEl.id = 'djalil-web-acc-reading-mask';
      document.body.appendChild(this.readingMaskEl);
    }
  }

  private applyInputLanguage(force = false): void {
    const inputLang = this.lang;

    if (inputLang === 'ar' || inputLang === 'en') {
      if (force || this.selectedLanguageOption === 'app') {
        this.selectedLanguageOption = 'app';
        if (this.djalilWebAcc.currentLang !== inputLang) {
          this.djalilWebAcc.changeLanguage(inputLang);
        }
      }
      return;
    }

    if (this.selectedLanguageOption === 'app') {
      this.selectedLanguageOption = this.djalilWebAcc.currentLang === 'ar' ? 'ar' : 'en';
    }
  }

  get hasAppLanguageOption(): boolean {
    return this.lang === 'ar' || this.lang === 'en';
  }

  private createMagnifier(): void {
    if (!document.querySelector('.djalil-web-acc-magnifier')) {
      this.magnifierEl = document.createElement('div');
      this.magnifierEl.className = 'djalil-web-acc-magnifier';
      this.magnifierEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.magnifierEl);
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.djalilWebAcc.settings.readingMask) {
      const mask = document.getElementById('djalil-web-acc-reading-mask');
      if (mask) {
        mask.style.top = e.clientY - 60 + 'px';
      }
    }

    if (this.djalilWebAcc.settings.textMagnifier) {
      if (this.magnifierTimeout) clearTimeout(this.magnifierTimeout);
      this.magnifierTimeout = setTimeout(() => this.updateMagnifier(e), 10);
    }
  }

  private updateMagnifier(e: MouseEvent): void {
    const magnifier = document.querySelector('.djalil-web-acc-magnifier') as HTMLElement;
    if (!magnifier) return;

    magnifier.style.display = 'none';
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    magnifier.style.display = 'block';

    if (
      !targetElement ||
      targetElement === document.body ||
      targetElement === document.documentElement
    ) {
      magnifier.style.display = 'none';
      return;
    }

    if ((targetElement as HTMLElement).closest?.('#djalil-web-acc-widget-container')) {
      magnifier.style.display = 'none';
      return;
    }

    let textContainer: HTMLElement | null = targetElement as HTMLElement;
    const blockTags = [
      'P',
      'DIV',
      'ARTICLE',
      'SECTION',
      'LI',
      'TD',
      'TH',
      'H1',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'SPAN',
      'A',
    ];

    while (textContainer && textContainer.textContent?.trim().length === 0) {
      textContainer = textContainer.parentElement;
    }

    if (textContainer && !blockTags.includes(textContainer.tagName)) {
      const parent = textContainer.closest(blockTags.join(',')) as HTMLElement;
      if (parent) textContainer = parent;
    }

    if (!textContainer || !textContainer.textContent?.trim()) {
      magnifier.style.display = 'none';
      return;
    }

    const fullText = textContainer.textContent.trim().replace(/\s+/g, ' ');
    const words = fullText.split(' ');
    if (words.length === 0) {
      magnifier.style.display = 'none';
      return;
    }

    const rect = textContainer.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    const estimatedPosition = Math.floor(words.length * (relativeY * 0.7 + relativeX * 0.3));
    const wordIndex = Math.max(0, Math.min(estimatedPosition, words.length - 1));

    const wordsToShow = 20;
    const wordsBeforeCursor = 8;
    let startIndex = Math.max(0, wordIndex - wordsBeforeCursor);
    let endIndex = Math.min(words.length, startIndex + wordsToShow);
    if (endIndex - startIndex < wordsToShow && startIndex > 0) {
      startIndex = Math.max(0, endIndex - wordsToShow);
    }

    let displayText = words.slice(startIndex, endIndex).join(' ');
    if (startIndex > 0) displayText = '... ' + displayText;
    if (endIndex < words.length) displayText = displayText + ' ...';

    magnifier.textContent = displayText;

    let left = e.clientX + 20;
    let top = e.clientY - magnifier.offsetHeight - 10;

    if (left + magnifier.offsetWidth > window.innerWidth - 20) {
      left = e.clientX - magnifier.offsetWidth - 20;
    }
    if (top < 20) {
      top = e.clientY + 20;
    }
    if (top + magnifier.offsetHeight > window.innerHeight - 20) {
      top = window.innerHeight - magnifier.offsetHeight - 20;
    }

    magnifier.style.left = left + 'px';
    magnifier.style.top = top + 'px';
  }
}
