"use client";

import { Component, type ReactNode } from "react";

interface PanelErrorBoundaryProps {
  onClose: () => void;
  children: ReactNode;
}

interface PanelErrorBoundaryState {
  hasError: boolean;
}

/**
 * Contains a render error to the one panel that threw it. Without this, any
 * panel crash (e.g. `next/image` rejecting a Notion cover whose host isn't
 * allowlisted in `next.config.ts`) unmounts the entire room to a blank
 * page — there's no other boundary above `Room`. `NavigationLayer` keys this
 * by panel id, so opening a different panel starts with a clean slate.
 * Colors inherit from the dialog surface, so it reads correctly on both the
 * paper and the dark ("screen"/"gallery") Modal variants.
 */
export class PanelErrorBoundary extends Component<PanelErrorBoundaryProps, PanelErrorBoundaryState> {
  state: PanelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): PanelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Panel failed to render:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div role="alert" className="flex flex-col items-center gap-4 px-6 py-10 text-center">
        <p className="font-serif text-sm italic opacity-75">This page got smudged — something went wrong while opening it.</p>
        <button
          type="button"
          onClick={this.props.onClose}
          className="font-hand-note text-xl opacity-70 transition-opacity duration-[var(--duration-fast)] hover:opacity-100"
        >
          ← back to the room
        </button>
      </div>
    );
  }
}
