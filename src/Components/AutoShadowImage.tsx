import React, { useEffect, useState } from "react";
import { Image as ImageAntd } from "antd";

interface AutoShadowImageProps {
  src: string;
  className?: string;
  alt?: string;
}

const AutoShadowImage: React.FC<AutoShadowImageProps> = ({
  src,
  className = "",
  alt = "",
}) => {
  const [shadowColor, setShadowColor] = useState<string>("rgba(0, 0, 0, 0.2)");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Para evitar problemas de CORS
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        const { data } = context.getImageData(0, 0, 1, 1);
        const [r, g, b] = data;
        setShadowColor(`rgba(${r}, ${g}, ${b}, 0.6)`);
      }
    };
  }, [src]);

  const boxShadow = `0 4px 20px ${shadowColor}, 0 2px 4px ${shadowColor}`;

  return (
    <ImageAntd
      src={src}
      alt={alt}
      height={"20rem"}
      className={`w-full max-h-96 object-cover transition-all ${className}`}
      style={{ boxShadow }}
    />
  );
};

export default AutoShadowImage;
