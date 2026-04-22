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

## API

### Input

- `lang`: `'ar' | 'en'`

### Exported symbols

- `AccessibilityWidgetComponent`
- `AccessibilityWidgetService`
