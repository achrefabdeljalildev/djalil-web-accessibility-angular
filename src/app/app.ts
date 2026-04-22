import { Component } from '@angular/core';
import { AccessibilityWidgetComponent } from './accessibility-widget/accessibility-widget.component';

@Component({
  selector: 'app-root',
  imports: [AccessibilityWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'accessibility-widget';
  lang: 'en' | 'ar' = 'en';

  switchLanguage(language: 'en' | 'ar') {
    this.lang = language;
  }
}
