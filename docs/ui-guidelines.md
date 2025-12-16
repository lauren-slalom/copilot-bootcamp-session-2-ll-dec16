# UI Guidelines

## Overview

This document outlines the UI design guidelines for the TODO application. The design aesthetic is playful, cute, and fun with a pastel unicorn theme that makes task management delightful.

## Design Philosophy

The interface should feel warm, inviting, and joyful. Every interaction should bring a smile to the user's face while maintaining usability and clarity.

## Color Palette

### Primary Colors (Pastel Unicorn Theme)
- **Soft Lavender**: `#E6D5F5` - Primary backgrounds
- **Baby Pink**: `#FFD6E8` - Accent elements
- **Mint Green**: `#D4F4DD` - Success states, completed tasks
- **Sky Blue**: `#D4E4FF` - Information elements
- **Peach**: `#FFE5D9` - Warning/due date highlights
- **Pale Yellow**: `#FFF9D6` - Highlights and hover states

### Neutral Colors
- **Pure White**: `#FFFFFF` - Card backgrounds
- **Soft Gray**: `#F5F5F7` - Secondary backgrounds
- **Dark Text**: `#4A4A4A` - Primary text
- **Light Text**: `#8E8E93` - Secondary text

## Typography

### Font Families
- **Primary**: System fonts for readability
- **Headings**: Rounded, friendly sans-serif fonts (e.g., Quicksand, Comfortaa)
- **Body**: Clean, legible sans-serif (e.g., Inter, Nunito)

### Font Sizes
- **Heading 1**: 32px (bold)
- **Heading 2**: 24px (semi-bold)
- **Body**: 16px (regular)
- **Small**: 14px (regular)
- **Caption**: 12px (regular)

## Component Guidelines

### Buttons

#### Style Specifications
- **Shape**: Highly rounded corners (border-radius: 20px or 50% for circular buttons)
- **Padding**: 12px 24px for standard buttons
- **Shadow**: `0 4px 0 0 rgba(0, 0, 0, 0.1)` - Sharp drop shadow with no blur
- **Hover Effect**: Slight scale (transform: scale(1.05))
- **Active/Press**: Shadow reduces to `0 2px 0 0 rgba(0, 0, 0, 0.1)` with slight downward translation

#### Button Variants
- **Primary Button**: Soft Lavender background with darker lavender text
- **Secondary Button**: Baby Pink background with darker pink text
- **Success Button**: Mint Green background with darker green text
- **Icon Buttons**: Circular, pastel backgrounds with white or colored icons

### Cards

#### Task Card Specifications
- **Background**: Pure white
- **Border-radius**: 16px
- **Shadow**: `0 6px 0 0 rgba(0, 0, 0, 0.08)` - Sharp, unblurred shadow
- **Padding**: 16px
- **Spacing**: 12px gap between cards
- **Hover State**: Slight lift with increased shadow `0 8px 0 0 rgba(0, 0, 0, 0.12)`

### Icons

#### Material Icons Usage
- **Edit Icon**: `edit` (pencil) - Soft Lavender color
- **Date Icon**: `event` or `calendar_today` - Sky Blue color
- **Delete Icon**: `delete` or `delete_outline` - Peach color
- **Complete Icon**: `check_circle` - Mint Green color
- **Add Icon**: `add_circle` - Baby Pink color

#### Icon Specifications
- **Size**: 20px-24px for standard icons
- **Style**: Rounded Material Icons variant when available
- **Color**: Match the pastel theme or use contrasting pastels for visibility

### Emoji Usage

#### Strategic Emoji Placement
- **Empty State**: 🦄 "No tasks yet! Add your first magical task!"
- **Completed Tasks**: ✨ for celebration
- **Overdue Tasks**: ⏰ or 📅
- **High Priority**: ⭐ or 💫
- **Success Messages**: 🎉, 🌈, or ✅
- **General Accent**: 🧁, 🌸, 🍰, 🎀 for decorative touches

### Input Fields

#### Text Input Specifications
- **Border**: 2px solid with pastel colors (e.g., Soft Lavender)
- **Border-radius**: 12px
- **Padding**: 10px 14px
- **Focus State**: Border color brightens, adds sharp shadow `0 4px 0 0 rgba(230, 213, 245, 0.5)`
- **Placeholder**: Light gray text with cute prompts (e.g., "What magical task will you complete today? ✨")

#### Date Picker
- **Icon**: Calendar icon in Sky Blue
- **Style**: Matches text input styling
- **Calendar Popup**: Rounded corners (16px), pastel header with current month

### Loading States

- **Spinner**: Pastel gradient spinner with smooth rotation
- **Skeleton**: Soft gray with subtle shimmer effect
- **Color**: Gradient between Soft Lavender and Baby Pink

## Layout Guidelines

### Spacing System
- **Base Unit**: 4px
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Extra Large**: 32px

### Grid System
- **Container Max-width**: 800px for optimal readability
- **Padding**: 16px on mobile, 24px on tablet+
- **Task List**: Single column with 12px gaps

## Animation Guidelines

### Transitions
- **Duration**: 200ms-300ms for most interactions
- **Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy, playful feel
- **Properties to Animate**:
  - `transform` for movement and scale
  - `box-shadow` for elevation changes
  - `background-color` for state changes

### Micro-interactions
- Button press: Bounce down slightly
- Task completion: Confetti or sparkle effect ✨
- Task deletion: Fade out with slight rotation
- New task addition: Slide in from top with bounce

## Accessibility

### Contrast Requirements
- Ensure all text meets WCAG AA standards (4.5:1 for normal text)
- Use darker pastel shades for text on light backgrounds
- Provide sufficient contrast for interactive elements

### Interactive Elements
- Minimum touch target size: 44x44px
- Clear focus indicators with visible outlines
- Keyboard navigation support for all interactions

### Screen Reader Support
- Proper ARIA labels for icon-only buttons
- Descriptive alt text for emojis (or make them decorative)
- Semantic HTML structure

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Larger touch targets (48x48px minimum)
- Simplified layouts with bottom-sheet style modals
- Floating action button for adding tasks

## Examples

### Example Task Card Structure
```
┌─────────────────────────────────────┐
│ ✨ Buy groceries for the week       │
│ 📅 Due: Dec 18, 2025                │
│ [✏️ Edit]  [✅ Complete]  [🗑️ Delete]│
└─────────────────────────────────────┘
```

### Example Button Styling
- Primary: Bubbly lavender button with sharp shadow
- Hover: Scales to 105%, shadow remains crisp
- Active: Appears "pressed" with reduced shadow height

## Implementation Notes

- Use Material-UI (MUI) components as base, customize with theme overrides
- Implement custom shadow values for sharp, unblurred shadows
- Create reusable button components with pastel variants
- Store color palette in CSS variables or theme configuration
- Use emoji as decorative elements, not as essential UI indicators
