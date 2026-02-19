import Image from "next/image";

interface ToolLogoProps {
  src?: string;
  alt: string;
  priority?: boolean;
}

export function ToolLogo({ src, alt, priority = false }: ToolLogoProps) {
  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center relative">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={80}
          height={80}
          className="object-contain"
          loading={priority ? "eager" : "lazy"}
          sizes="80px"
          quality={90}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Logo</span>
        </div>
      )}
    </div>
  );
}
