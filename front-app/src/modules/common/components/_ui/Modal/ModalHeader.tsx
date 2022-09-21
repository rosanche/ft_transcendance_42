import { PropsWithChildren } from 'react'

export const ModalHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full bg-info-100 p-2 font-headings text-sm md:py-5 md:px-12">
      <p className="font-bold">{children}</p>
    </div>
  )
}
