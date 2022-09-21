import { IconCross, IconArrowLeft } from '../../_icons/icons'

export interface ModalHeaderButtonProps {
  onClose: () => void
  onBack?: () => void
  type?: 'close' | 'back' | 'none'
  iconVariant?: 'cross' | 'arrow'
}

export const ModalHeaderButton = ({
  onClose,
  onBack,
  type = 'close',
  iconVariant = 'cross',
}: ModalHeaderButtonProps) => {
  return (
    <>
      {type !== 'none' && (
        <button
          className="absolute left-2 top-2 md:left-4 md:top-4"
          onClick={type === 'back' ? onBack : onClose}
          data-testid="modal-header-button"
        >
          {getIcon(iconVariant)}
        </button>
      )}
    </>
  )
}

const getIcon = (iconVariant: ModalHeaderButtonProps['iconVariant']) => {
  switch (iconVariant) {
    case 'arrow':
      return <IconArrowLeft className="h-6 w-6" />
    default:
      return <IconCross className="h-6 w-6" />
  }
}
