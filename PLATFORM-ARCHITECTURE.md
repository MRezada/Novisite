# معماری پیشنهادی Novi One

این سند برای تبدیل چهار نرم‌افزار مستقل نووی‌سافت به یک تجربه‌ی سازمانی واحد نوشته شده است. هدف این نیست که چهار محصول از نو نوشته شوند؛ هدف این است که یک **Shell / Core Platform** مشترک روی آن‌ها قرار بگیرد و مشتری فقط ماژول‌هایی را که خریده است ببیند.

## مدل محصول

**Novi One Core** با خرید هر ماژول فعال می‌شود و شامل این موارد است:

- سازمان (Tenant / Workspace)
- کاربران، نقش‌ها و سطح دسترسی
- ورود یکپارچه و Session مشترک
- مرکز اعلان
- Audit Log
- تنظیمات سازمان
- مدیریت لایسنس و Entitlement ماژول‌ها
- API Gateway / Integration Layer

چهار ماژول:

1. **Novi Inventory** — انبار و مدیریت قطعات
2. **Novi BI** — هوش تجاری و داشبورد مدیریتی
3. **Novi IT** — مدیریت و پشتیبانی IT
4. **Novi Desk** — تیکتینگ و میز خدمت / ITSM

## تجربه مشتری

بعد از ورود، مشتری وارد یک Workspace می‌شود. صفحه‌ی Home فقط ماژول‌هایی را که خریداری شده‌اند به‌صورت فعال نمایش می‌دهد. ماژول‌های دیگر به‌صورت Locked/Available دیده می‌شوند و دکمه «افزودن ماژول» دارند.

نمونه وضعیت:

```text
سازمان آریا
├── Inventory     ACTIVE
├── Novi IT       ACTIVE
├── Novi Desk     ACTIVE
└── Novi BI       AVAILABLE
```

مشتری برای اضافه کردن Novi BI نیاز به ساخت حساب جدید، تعریف مجدد کاربران یا تنظیم دوباره نقش‌های پایه ندارد.

## مدل دیتای پیشنهادی

```text
organizations
- id
- name
- slug
- status
- plan
- created_at

users
- id
- email
- name
- status

organization_members
- organization_id
- user_id
- role_id

roles
- id
- organization_id
- name

modules
- key                inventory | bi | it | desk
- name
- version

organization_modules
- organization_id
- module_key
- status             trial | active | suspended | expired
- starts_at
- expires_at
- seats
- config_json

permissions
- role_id
- module_key
- permission_key

sessions
- user_id
- organization_id
- expires_at

audit_logs
- organization_id
- user_id
- module_key
- action
- entity_type
- entity_id
- metadata_json
- created_at
```

## احراز هویت

بهترین حالت این است که Login در Core انجام شود و ماژول‌ها به همان Identity Provider اعتماد کنند.

گزینه پیشنهادی:

- Core Auth با OIDC/OAuth2
- Access Token کوتاه‌عمر
- Refresh Session در دامنه مرکزی
- claimهای اصلی: `sub`, `org_id`, `roles`, `module_entitlements`
- برای Enterprise: اتصال به Active Directory / Entra ID / LDAP در لایه Core

اگر نرم‌افزارهای فعلی بک‌اندهای جدا دارند، لازم نیست احراز هویت آن‌ها فوراً بازنویسی شود؛ می‌توان ابتدا Token Exchange یا Gateway را بین Core و سرویس موجود قرار داد.

## مسیر URL پیشنهادی

برای تجربه یکپارچه:

```text
app.novisoft.ir/                 Workspace
app.novisoft.ir/inventory/      انبار
app.novisoft.ir/bi/             هوش تجاری
app.novisoft.ir/it/             مدیریت IT
app.novisoft.ir/desk/           تیکتینگ
```

در لایه زیرین هر ماژول می‌تواند سرویس مستقل خودش را داشته باشد:

```text
inventory-api.internal
bi-api.internal
it-api.internal
desk-api.internal
```

Reverse Proxy / API Gateway مسیرها را به سرویس مربوط هدایت می‌کند.

## Entitlement و خرید ماژول

در هر Request حساس، فقط مخفی کردن آیتم منو کافی نیست. Core یا Gateway باید بررسی کند:

```text
organization_modules.status == active
```

جریان فعال‌سازی:

1. فروش/ادمین ماژول را برای سازمان فعال می‌کند.
2. رکورد `organization_modules` ایجاد یا Active می‌شود.
3. Session/Token کاربر Entitlement جدید را دریافت می‌کند.
4. کارت ماژول در Workspace فعال می‌شود.
5. Migration/Provisioning اختصاصی ماژول اجرا می‌شود.
6. کاربر بدون Login مجدد وارد ماژول می‌شود.

## ارتباط بین ماژول‌ها

بهتر است از روز اول دیتابیس چهار ماژول را یکی نکنیم. هر ماژول مالک داده تخصصی خودش بماند و فقط شناسه‌های مشترک استاندارد شوند.

شناسه‌های مشترک مهم:

- `organization_id`
- `user_id`
- `asset_id`
- `ticket_id`
- `part_id`
- `department_id`

نمونه Cross-module Flow:

```text
Novi Desk: Ticket #432
      ↓ relates_to
Novi IT: Asset LAP-882
      ↓ replacement_part
Novi Inventory: Part SSD-1TB / Issue Transaction
      ↓ analytics_event
Novi BI: MTTR + Part Consumption Dashboard
```

## Event Bus

برای اتصال کم‌وابستگی، رخدادهای مهم به Event Bus ارسال شوند:

- `ticket.created`
- `ticket.resolved`
- `asset.assigned`
- `asset.health_changed`
- `inventory.low_stock`
- `inventory.issue_created`

Novi BI می‌تواند این رخدادها را برای تحلیل دریافت کند بدون اینکه مستقیم به منطق داخلی هر ماژول وابسته شود.

در نسخه اول حتی یک Outbox Table + Worker ساده کافی است؛ نیاز نیست از ابتدا Kafka اضافه شود.

## طراحی Frontend Shell

Shell باید مالک این بخش‌ها باشد:

- Header
- Sidebar اصلی
- Workspace switcher
- User menu
- Notifications
- Global search
- Module launcher
- Theme / Design Tokens

هر ماژول منوی داخلی خودش را بعد از ورود به ماژول نمایش می‌دهد. این باعث می‌شود UI چهار نرم‌افزار حس یک خانواده محصول را داشته باشد، بدون اینکه همه صفحات در یک پروژه Frontend ادغام شوند.

## Design Tokens مشترک

پالت پایه پیشنهادی:

```text
Navy 900   #071B31
Navy 800   #0A2A4A
Blue 600   #2467E8
Cyan 500   #16B8D9
Iris 500   #6557E8
Surface    #F6F8FC
Border     #D8E3EE
Text       #08213F
Muted      #5B7088
Success    #1FA97A
Warning    #E5A62E
Danger     #E45867
```

رنگ هر ماژول می‌تواند Accent خودش را داشته باشد، ولی Navigation، Typography، Radius، spacing و stateها باید مشترک باشند.

## مدل فروش پیشنهادی

به‌جای چهار پکیج غیرقابل انعطاف:

**Base/Core + Module License**

- Core: همراه اولین ماژول
- Inventory: مستقل
- BI: مستقل
- IT: مستقل
- Desk: مستقل
- Enterprise Add-ons: SSO، SLA ویژه، نصب On-Prem، Audit پیشرفته، Integration Pack

قیمت‌گذاری هر ماژول می‌تواند Metric مناسب خودش را داشته باشد:

- Inventory: تعداد کاربر/انبار یا سطح امکانات
- BI: تعداد داشبورد/منبع داده/کاربر Viewer
- IT: تعداد Asset / Endpoint
- Desk: تعداد Agent / سطح SLA

بهتر است در سایت قیمت عددی ثابت نمایش داده نشود تا زمانی که مدل دقیق تجاری نهایی شود؛ سایت فعلی از «درخواست دمو و برآورد» استفاده می‌کند.

## مسیر اجرایی کم‌ریسک

### فاز 1 — تجربه یکپارچه
- طراحی Core Shell
- Workspace و Module Launcher
- Login مرکزی
- Design System مشترک
- Entitlement ساده

### فاز 2 — اتصال نرم‌افزارهای فعلی
- SSO بین Core و چهار نرم‌افزار
- URL و Navigation یکپارچه
- کاربران/نقش‌های مشترک
- Audit مرکزی

### فاز 3 — Cross-module Workflows
- Ticket ↔ Asset
- Asset ↔ Part
- BI روی داده سه ماژول دیگر
- Notification مشترک

### فاز 4 — Enterprise
- AD/Entra ID
- On-Prem deployment
- Advanced audit
- Backup/DR policy
- Billing/Licensing automation

## نکته معماری مهم

چهار نرم‌افزار را برای «یکپارچه دیده شدن» داخل یک Monolith ادغام نکنید. تجربه کاربر می‌تواند یکپارچه باشد، در حالی که سرویس‌ها و چرخه انتشار هر ماژول مستقل بمانند. این مدل برای رشد محصول، فروش ماژولار و نگه‌داری تیمی انعطاف بیشتری دارد.
