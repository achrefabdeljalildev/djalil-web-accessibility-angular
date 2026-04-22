# djalil-accessibility-widget

Angular standalone accessibility widget component package.

## Install

```bash
npm install djalil-accessibility-widget
```

## Use in an Angular app

1. Add the component to your template:

```html
<app-accessibility-widget [lang]="lang"></app-accessibility-widget>
```

2. Import the standalone component in the parent component:

```ts
import { AccessibilityWidgetComponent } from 'djalil-accessibility-widget';
```

3. Add package styles (global):

```scss
@use 'djalil-accessibility-widget/styles/fontawesome.css';
@use 'djalil-accessibility-widget/styles/accessibility-widget.css';
```

## API

### Input

- `lang`: `'ar' | 'en'`

### Exported symbols

- `AccessibilityWidgetComponent`
- `AccessibilityWidgetService`
