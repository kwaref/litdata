import {create} from 'zustand'

// Define types for your widgets
type Widget = {
  id: string
  name: string
  description: string
  // Add other properties as needed
}

interface WidgetStore {
  widgets: Widget[]
  addWidget: (widget: Widget) => void
  removeWidget: (widgetId: string) => void
}

// Create Zustand store for widgets
export const widgetStore = create<WidgetStore>(set => ({
  widgets: [],
  addWidget: (widget: Widget) => set(state => ({widgets: [...state.widgets, widget]})),
  removeWidget: (widgetId: string) =>
    set(state => ({widgets: state.widgets.filter(widget => widget.id !== widgetId)})),
}))
