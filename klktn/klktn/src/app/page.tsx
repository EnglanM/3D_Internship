"use client";

import ItemSelector from "@/components/ItemSelector";
import { EcsProvider } from "@/context/EcsContext";

export default function Home() {
  return (
    <EcsProvider>
      <div className="absolute bottom-0 h-auto w-auto">
        <ItemSelector />
      </div>
    </EcsProvider>
  );
}
