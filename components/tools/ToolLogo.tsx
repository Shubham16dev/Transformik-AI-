import Image from "next/image";

interface ToolLogoProps {
  src?: string;
  alt: string;
}

export function ToolLogo({ src, alt }: ToolLogoProps) {
  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={96}
          height={96}
          className="object-contain"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Logo</span>
        </div>
      )}
    </div>
  );
}
