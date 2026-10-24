import type { Metadata } from "next";
import { InteractiveDemo } from "@/components/InteractiveDemo";
export const metadata: Metadata = {title:"دموی نمایشی Novi One",description:"دموی محدود انبار و تیکتینگ با داده ساختگی و تغییرات موقت در مرورگر."};
export default function DemoPage(){return <InteractiveDemo/>;}
