import Link from "next/link";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/Ui";

const points = [
  { icon: "layers", title: "یک هسته، چند ماژول", text: "کاربران، نقش‌ها، اعلان‌ها و تنظیمات یک‌بار ساخته می‌شوند و بین ماژول‌ها مشترک می‌مانند." },
  { icon: "check", title: "خرید فقط چیزی که لازم دارید", text: "سازمان می‌تواند با یک ماژول شروع کند و بدون مهاجرت یا پنل جدا، ماژول‌های بعدی را اضافه کند." },
  { icon: "plug", title: "اتصال فرایندها و داده‌ها", text: "تیکت، دارایی، قطعه و گزارش می‌توانند به هم وصل شوند؛ API هم برای سیستم‌های موجود سازمان در نظر گرفته می‌شود." },
  { icon: "code", title: "قابل توسعه برای نیاز اختصاصی", text: "اگر فرایند شما داخل ماژول آماده جا نشود، قابلیت یا نرم‌افزار سفارشی روی همان نگاه محصول‌محور توسعه می‌دهیم." },
];

export function Proof({ title, text }: { title?: string; text?: string }) {
  return (
    <section className="proof-band" aria-labelledby="proof-title">
      <div className="wrap">
        <SectionHead title={title || "محصول آماده، بدون محدود کردن مسیر رشد"} text={text || "از نرم‌افزار آماده شروع کنید و هرجا فرایند شما خاص شد، همان‌جا توسعه اختصاصی را اضافه کنید."} />
        <div className="proof-grid">
          {points.map((p) => (
            <article className="proof-card" key={p.title}>
              <span className="proof-icon"><Icon name={p.icon} /></span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <div className="proof-note">
          <span>نمی‌دانید از کدام ماژول شروع کنید؟</span>
          <Link href="/products#build-your-plan">پلن سازمان را بسازید <Icon name="arrow" /></Link>
        </div>
      </div>
    </section>
  );
}
