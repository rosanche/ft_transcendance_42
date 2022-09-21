import { Modal, ModalProps } from 'modules/common/components/_ui/Modal/Modal'
import React, { DependencyList } from 'react'
import { useModal } from 'react-modal-hook'

export type ContentModalProps = Pick<
  ModalProps,
  | 'classNames'
  | 'headerButtonType'
  | 'headerIconButtonVariant'
  | 'headerTitle'
  | 'overlayTransitionType'
  | 'shouldCloseOnEsc'
  | 'shouldCloseOnOverlayClick'
  | 'content'
  | 'footer'
  | 'onBack'
> & {
  onCancel?: () => unknown | Promise<unknown>
}

interface ReactModalProps {
  in: boolean
  enter: any
  exit: any
  onExited: () => void
}

export const useContentModal = (
  {
    onCancel,
    onBack,
    footer,
    content,
    ...props
  }: ContentModalProps,
  deps: DependencyList = []
) => {
  const [showModal, hideModal] = useModal(
    ({ in: open }: ReactModalProps) => {
      const onClose = async () => {
        if (onCancel) {
          await onCancel()
        }
        hideModal()
      }

      return (
        <Modal
          isOpen={open}
          onClose={onClose}
          onBack={onBack}
          footer={
            footer && footer
          }
          content={content}
          hideModal={hideModal}
          {...props}
        />
      )
    },
    [footer, content, ...deps]
  )

  return {
    showModal,
    hideModal,
  }
}
