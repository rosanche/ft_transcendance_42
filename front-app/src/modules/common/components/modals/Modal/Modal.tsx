import clsx from 'clsx'
import { HideModalContextProvider } from 'modules/common/context/HideModalContext'
import React from 'react'
import { ModalBody } from './ModalBody'
import { ModalFooter } from './ModalFooter'
import { ModalHeaderButton, ModalHeaderButtonProps } from './ModalHeaderButton'
import { ModalRoot, TransitionType } from './ModalRoot'

export interface ModalProps {
  isOpen: boolean
  onClose: () => unknown
  onBack?: () => unknown
  classNames?: {
    modalRoot?: string
    modalBody?: string
    modalFooter?: string
  }
  headerTitle?: string
  headerButtonType?: ModalHeaderButtonProps['type']
  headerIconButtonVariant?: ModalHeaderButtonProps['iconVariant']
  overlayTransitionType?: TransitionType
  shouldCloseOnEsc?: boolean
  shouldCloseOnOverlayClick?: boolean
  content: React.ReactNode
  footer?: React.ReactNode
  hideModal: () => void
}

export const Modal = ({
  isOpen,
  onClose,
  onBack,
  classNames,
  headerTitle,
  headerButtonType,
  headerIconButtonVariant,
  overlayTransitionType,
  shouldCloseOnEsc,
  shouldCloseOnOverlayClick,
  content,
  footer,
  hideModal,
}: ModalProps) => {
  return (
    <HideModalContextProvider hideModal={hideModal}>
      <ModalRoot
        isOpen={isOpen}
        onRequestClose={onClose}
        className={classNames?.modalRoot}
        overlayTransitionType={overlayTransitionType}
        shouldCloseOnEsc={shouldCloseOnEsc}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      >
        <div
          className=
            'z-10 w-full flex-row'
          
        >
          <ModalHeaderButton
            onBack={onBack}
            onClose={onClose}
            type={headerButtonType}
            iconVariant={headerIconButtonVariant}
          />
          {headerTitle && (
            <span className="my-4 mx-10 inline-block font-headings text-sm font-bold text-white">
              {headerTitle}
            </span>
          )}
        </div>
        <ModalBody className={classNames?.modalBody}>{content}</ModalBody>
        {!!footer && (
          <ModalFooter
            className={clsx(
              'flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0',
              classNames?.modalFooter
            )}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalRoot>
    </HideModalContextProvider>
  )
}
