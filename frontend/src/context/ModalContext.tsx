import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────
export type ModalTab = 'export' | 'domestic';

interface ModalState {
  isOpen: boolean;
  initialTab: ModalTab;
}

interface ModalContextValue {
  modalState: ModalState;
  openModal: (tab?: ModalTab) => void;
  closeModal: () => void;
}

// ─── Context ──────────────────────────────────────────────────────
const ModalContext = createContext<ModalContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    initialTab: 'export',
  });

  const openModal = useCallback((tab: ModalTab = 'export') => {
    setModalState({ isOpen: true, initialTab: tab });
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    document.body.classList.add('overflow-hidden');
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
  }, []);

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside <ModalProvider>');
  return ctx;
}
