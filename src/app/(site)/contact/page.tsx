import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactFormFromQuery } from "@/components/ContactFormFromQuery";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/Ui";
import { getSettings } from "@/lib/db";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMeta({ settings: s, path: "/contact", title: "تماس با ما و درخواست مشاوره", description: `پروژه‌ی نرم‌افزاری خود را با ${s.nameFa} در میان بگذارید؛ معمولاً ظرف یک روز کاری پاسخ می‌دهیم.` });
}

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title="درباره‌ی پروژه‌تان بگویید" lead="لازم نیست سند فنی آماده داشته باشید. مسئله، کاربران و چیزی که می‌خواهید بهتر شود را بنویسید؛ معمولاً ظرف یک روز کاری پاسخ می‌دهیم." crumbs={[{ label: "تماس", href: "/contact" }]} />
      <section className="sec" style={{ paddingTop: 24 }}>
        <div className="wrap contact-grid">
          <div>
            <div className="contact-intro">
              <span className="eyebrow">شروع همکاری</span>
              <h2>سه قدم ساده برای شروع</h2>
              <ol className="contact-steps">
                <li><strong>۱. مسئله را بنویسید</strong><span>هدف، وضعیت فعلی و کاربران محصول برای شروع کافی است.</span></li>
                <li><strong>۲. نیاز را بررسی می‌کنیم</strong><span>اگر پروژه در حوزه تخصص ما باشد، سؤال‌های فنی و تجاری لازم را جمع می‌کنیم.</span></li>
                <li><strong>۳. مسیر بعدی را مشخص می‌کنیم</strong><span>جلسه تحلیل، محدوده نسخه اول یا پیشنهاد همکاری بعدی را شفاف می‌کنیم.</span></li>
              </ol>
            </div>
            <Suspense fallback={<p role="status">در حال آماده‌سازی فرم…</p>}><ContactFormFromQuery email={s.email} /></Suspense>
          </div>
          <div>
          <ul className="info">
            {s.email && <li><Icon name="mail" /><div><small>ایمیل</small><a className="ltr" href={`mailto:${s.email}`}><strong>{s.email}</strong></a></div></li>}
            {s.phone && <li><Icon name="phone" /><div><small>تلفن</small><a className="ltr" href={`tel:${s.phone}`}><strong>{s.phone}</strong></a></div></li>}
            {s.telegram && <li><Icon name="send" /><div><small>تلگرام</small><a className="ltr" href={`https://t.me/${s.telegram}`} target="_blank" rel="noopener noreferrer"><strong>@{s.telegram}</strong></a></div></li>}
            {(s.city || s.address) && <li><Icon name="pin" /><div><small>نشانی</small><strong>{[s.city, s.address].filter(Boolean).join("، ")}</strong></div></li>}
            {s.hours && <li><Icon name="clock" /><div><small>ساعت پاسخ‌گویی</small><strong>{s.hours}</strong></div></li>}
          </ul>
          <div className="contact-note">
            <Icon name="shield" />
            <div><strong>برای شروع، اطلاعات حساس لازم نیست.</strong><p>در فرم اولیه فقط چیزهایی را بنویسید که با اشتراک آن راحت هستید. اگر پروژه نیاز به محرمانگی رسمی داشته باشد، می‌توان ادامه گفتگو را بعد از توافق مناسب انجام داد.</p></div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
