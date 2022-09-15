import clsx from "clsx";
import { useQRCode } from "next-qrcode";

interface Props {
  url: string;
  className: string;
}

export const QrCode = ({ url, className }: Props) => {
  const { Canvas } = useQRCode();

  return (
    <div className={clsx("", className)}>
      <Canvas
        text={url}
        options={{
          type: "image/jpeg",
          quality: 0.3,
          level: "M",
        }}
      />
    </div>
  );
};
