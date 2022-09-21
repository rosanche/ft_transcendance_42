import clsx from 'clsx'
import { PropsWithChildren } from 'react'

export const ModalFooter: React.FC<
  PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'bottom-0 flex w-full items-center justify-center border-t-2 border-info-100 bg-white px-4 py-4 md:px-6',
        className
      )}
    >
      {children}
    </div>
  )
}
