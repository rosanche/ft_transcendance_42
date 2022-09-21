import clsx from 'clsx'
import { PropsWithChildren } from 'react'

export const ModalBody: React.FC<
  PropsWithChildren<{
    className?: string
  }>
> = ({ children, className }) => {
  return (
    <div className="w-full min-w-min flex-1 overflow-auto">
      <div
        className={clsx(
          'm-auto flex flex-col p-4 pt-10 md:py-8 md:px-10',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
