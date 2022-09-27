import clsx from 'clsx'
import ReactModal from 'react-modal'

export type TransitionType = 'transition-opacity' | 'transition-none'

interface ModalRootProps extends ReactModal.Props {
  overlayTransitionType?: TransitionType
}

export const ModalRoot: React.FC<ModalRootProps> = ({
  children,
  className,
  overlayTransitionType = 'transition-opacity',
  ...props
}) => {
  return (
    <ReactModal
      className={{
        base: clsx(
          'flex flex-col items-center overflow-hidden text-center',
          className
        ),
        afterOpen:
          'absolute inset-x-4 m-auto max-h-modal overflow-auto rounded-3xl bg-gray-dark shadow-md outline-none sm:inset-auto sm:max-w-max',
        beforeClose: '',
      }}
      overlayClassName={{
        base: clsx(
          'flex justify-center items-center opacity-0 z-50',
          overlayTransitionType === 'transition-opacity' &&
            'transition-opacity duration-500'
        ),
        afterOpen: 'fixed bg-info-400 inset-0 bg-opacity-90 opacity-100',
        beforeClose: '',
      }}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      {...props}
    >
      {children}
    </ReactModal>
  )
}
