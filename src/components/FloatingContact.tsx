import { Icon } from "./Icon";

/** دکمه‌های شناور تماس سریع؛ فقط اگر در تنظیمات مقدار داشته باشند نمایش داده می‌شوند. */
export function FloatingContact({ whatsapp, telegram, phone }: { whatsapp: string; telegram: string; phone: string }) {
  const items = [
    whatsapp && { href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`, label: "گفتگو در واتس‌اپ", icon: "chat" },
    telegram && { href: `https://t.me/${telegram.replace(/^@/, "")}`, label: "گفتگو در تلگرام", icon: "send" },
    phone && { href: `tel:${phone.replace(/\s/g, "")}`, label: "تماس تلفنی", icon: "phone" },
  ].filter(Boolean) as { href: string; label: string; icon: string }[];
  if (!items.length) return null;
  return (
    <div className="fab" aria-label="تماس سریع">
      {items.map((x) => (
        <a key={x.href} href={x.href} target={x.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={x.label} title={x.label}>
          <Icon name={x.icon} />
        </a>
      ))}
    </div>
  );
}
