"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContentWebPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/content-web/home");
    }, [router]);

    return null;
}
