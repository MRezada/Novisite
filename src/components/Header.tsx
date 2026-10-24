"use client";
import { assetPath } from "@/lib/asset-path";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type Props = { nav: { label: string; href: string }[]; logo: string; name: string };

export function Header({ nav, logo, name }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);
  const navigation = nav.filter((link) => link.href.replace(/\/$/, "") !== "/insights");
  const servicesIndex = navigation.findIndex((link) => link.href === "/services");
  navigation.splice(servicesIndex < 0 ? navigation.length : servicesIndex + 1, 0, { label: "وبلاگ", href: "/insights" });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key !== "Tab") return;
      const links = Array.from(drawer.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
      const first = menuButton.current;
      const last = links.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1021px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`} style={open ? { zIndex: 95 } : undefined}>
        <div className="wrap header-in">
          <Link href="/" className="brand" aria-label={`${name} — صفحه اصلی`}>
            {logo && <img src={assetPath(logo)} alt="" width={42} height={36} />}
            <span>{name}</span>
          </Link>
          <nav className="nav" aria-label="ناوبری اصلی">
            {navigation.map((l) => (
              <Link key={l.href} href={l.href} className={l.href === "/insights" ? "nav-blog" : undefined} aria-current={path === l.href || (l.href !== "/" && path.startsWith(`${l.href}/`)) ? "page" : undefined}>{l.label}</Link>
            ))}
          </nav>
          <Link href="/contact?subject=suite-demo" className="btn btn-dark btn-sm">درخواست دمو <Icon name="arrow" /></Link>
          <button ref={menuButton} className="menu-btn" type="button" onClick={() => setOpen(!open)} aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? "بستن منو" : "باز کردن منو"}>
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <nav ref={drawer} id="mobile-navigation" className={`drawer${open ? " open" : ""}`} aria-label="ناوبری موبایل" aria-hidden={!open} inert={!open}>
        {navigation.map((l) => <Link key={l.href} href={l.href} className={`dl${l.href === "/insights" ? " nav-blog" : ""}`} onClick={() => setOpen(false)} aria-current={path === l.href || path.startsWith(`${l.href}/`) ? "page" : undefined} tabIndex={open ? 0 : -1}>{l.label}</Link>)}
        <Link href="/contact?subject=suite-demo" className="btn btn-dark" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>درخواست دمو <Icon name="arrow" /></Link>
      </nav>
    </>
  );
}
