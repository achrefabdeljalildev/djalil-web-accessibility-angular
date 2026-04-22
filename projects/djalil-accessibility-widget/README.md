# @jbeche/accessibility-widget

Angular standalone accessibility widget component package.

## Install

```bash
npm install @jbeche/accessibility-widget
```

## Use in an Angular app

1. Add the component to your template:

```html
<ng-accessibility-widget [lang]="lang"></ng-accessibility-widget>
```

2. Import the standalone component in the parent component:

```ts
import { AccessibilityWidgetComponent } from '@jbeche/accessibility-widget';
```

3. Styles are loaded automatically by the component (no manual CSS imports required).

## Theme customization

You can customize widget colors from the host app by defining CSS variables globally (for example in
`styles.scss`) or on a parent container.

```scss
:root {
  --ng-accessibility-widget-color-primary: #0f766e;
  --ng-accessibility-widget-color-primary-soft: #ccfbf1;
  --ng-accessibility-widget-color-text: #1f2937;
  --ng-accessibility-widget-color-text-muted: #6b7280;
  --ng-accessibility-widget-color-surface: #f8fafc;
  --ng-accessibility-widget-color-surface-muted: #ecfeff;
  --ng-accessibility-widget-color-border: #cbd5e1;
  --ng-accessibility-widget-color-border-hover: #94a3b8;
  --ng-accessibility-widget-color-surface-hover: #f1f5f9;
  --ng-accessibility-widget-color-danger: #dc2626;
  --ng-accessibility-widget-color-danger-hover: #b91c1c;
  --ng-accessibility-widget-color-link-muted: #0f766e;
  --ng-accessibility-widget-color-white: #ffffff;
}
```

Available color variables:

- `--ng-accessibility-widget-color-primary`
- `--ng-accessibility-widget-color-primary-soft`
- `--ng-accessibility-widget-color-text`
- `--ng-accessibility-widget-color-text-muted`
- `--ng-accessibility-widget-color-surface`
- `--ng-accessibility-widget-color-surface-muted`
- `--ng-accessibility-widget-color-border`
- `--ng-accessibility-widget-color-border-hover`
- `--ng-accessibility-widget-color-surface-hover`
- `--ng-accessibility-widget-color-danger`
- `--ng-accessibility-widget-color-danger-hover`
- `--ng-accessibility-widget-color-link-muted`
- `--ng-accessibility-widget-color-white`

## API

### Input

- `lang`: `'ar' | 'en'`

### Exported symbols

- `AccessibilityWidgetComponent`
- `AccessibilityWidgetService`
