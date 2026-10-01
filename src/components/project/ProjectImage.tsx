import Image from "next/image";
import type { ProjectAsset } from "@/sanity/types";

export default function ProjectImage({
  asset,
  priority = false,
  className,
}: {
  asset: ProjectAsset;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={className ? `case-image ${className}` : "case-image"}>
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes="(max-width: 948px) calc(100vw - 48px), 900px"
        priority={priority}
      />
    </div>
  );
}

