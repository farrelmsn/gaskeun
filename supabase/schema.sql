-- ============================================================================
-- GasNPSO Platform V2.0 — Skema Database PostgreSQL (Supabase)
-- PT Pertamina Patra Niaga — Sales Area Retail Bandung
-- Wilayah: Kota Bandung, Kab. Bandung, Kab. Sumedang, Kab. Garut
-- ============================================================================

create table if not exists roles (
  role_id serial primary key,
  role_name varchar(32) unique not null -- pertamina, agen, outlet, konsumen
);

insert into roles (role_name) values ('pertamina'), ('agen'), ('outlet'), ('konsumen')
on conflict (role_name) do nothing;

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role_id int references roles(role_id),
  full_name varchar(150) not null,
  email varchar(150) unique not null,
  phone varchar(32),
  account_status varchar(20) default 'Aktif',
  nip varchar(64),
  jabatan varchar(120),
  unit_kerja varchar(150),
  created_at timestamptz default now()
);

create table if not exists products (
  product_id serial primary key,
  sku varchar(64) unique not null,
  product_name varchar(150) not null,
  product_variant varchar(64) not null,
  price numeric(12,2) not null
);

insert into products (sku, product_name, product_variant, price) values
  ('bright_gas_5_5', 'Bright Gas 5,5 Kg (Refill & Trade-In)', '5.5 kg', 104000),
  ('bright_gas_12', 'Bright Gas 12 Kg (Refill & Trade-In)', '12 kg', 218000),
  ('bright_gas_can_220', 'Bright Gas Canister 220 gr', '220 gr', 24000),
  ('elpiji_50', 'Elpiji Non-Subsidi 50 Kg', '50 kg', 890000)
on conflict (sku) do nothing;

create table if not exists agents (
  agent_id serial primary key,
  reg_code varchar(32) unique not null,
  user_id uuid references profiles(user_id) on delete set null,
  agent_name varchar(150) not null,
  pic varchar(120) not null,
  phone varchar(32),
  email varchar(150),
  region varchar(64) not null,
  district varchar(100),
  address text,
  sppbe varchar(120),
  latitude numeric(10,6),
  longitude numeric(10,6),
  operating_hours varchar(64) default '07:00 - 20:00',
  warehouse_capacity int default 1500,
  status varchar(32) default 'Valid',
  created_at timestamptz default now()
);

create table if not exists outlets (
  outlet_id serial primary key,
  reg_code varchar(32) unique not null,
  user_id uuid references profiles(user_id) on delete set null,
  agent_id int references agents(agent_id) on delete set null,
  outlet_name varchar(150) not null,
  pic varchar(120) not null,
  phone varchar(32),
  email varchar(150),
  region varchar(64) not null,
  district varchar(100),
  address text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  operating_hours varchar(64) default '08:00 - 20:00 WIB',
  operational_status varchar(24) default 'Buka',
  account_status varchar(24) default 'Aktif',
  pds_active boolean default true,
  delivery_radius_km numeric(4,1) default 5.0,
  delivery_fee_55 numeric(10,2) default 5000,
  delivery_fee_12 numeric(10,2) default 10000,
  service_information text,
  bank_name varchar(64),
  bank_account varchar(64),
  bank_holder varchar(120),
  created_at timestamptz default now()
);

create table if not exists warehouse_stock (
  warehouse_stock_id serial primary key,
  agent_id int references agents(agent_id) on delete cascade,
  product_id int references products(product_id) on delete cascade,
  ready_stock int default 0,
  empty_stock int default 0,
  quarantine_stock int default 0,
  updated_at timestamptz default now(),
  unique(agent_id, product_id)
);

create table if not exists outlet_stock (
  outlet_stock_id serial primary key,
  outlet_id int references outlets(outlet_id) on delete cascade,
  product_id int references products(product_id) on delete cascade,
  ready_stock int default 0,
  empty_stock int default 0,
  quarantine_stock int default 0,
  selling_price numeric(12,2) not null,
  trade_in_fee numeric(12,2) default 0,
  new_cylinder_price numeric(12,2),
  updated_at timestamptz default now(),
  unique(outlet_id, product_id)
);

create table if not exists stock_requests (
  request_id serial primary key,
  ticket_no varchar(48) unique not null,
  outlet_id int references outlets(outlet_id) on delete cascade,
  agent_id int references agents(agent_id) on delete cascade,
  items jsonb not null,
  priority varchar(40) default 'Normal (Reguler)',
  request_status varchar(24) default 'Diajukan',
  note text,
  agent_response text,
  request_date timestamptz default now()
);

create table if not exists stock_transfers (
  transfer_id serial primary key,
  doc_no varchar(48) unique not null,
  agent_id int references agents(agent_id) on delete cascade,
  outlet_id int references outlets(outlet_id) on delete cascade,
  items jsonb not null,
  driver_note text,
  transfer_status varchar(24) default 'Selesai',
  transfer_date timestamptz default now()
);

create table if not exists consumer_locations (
  location_id serial primary key,
  user_id uuid references profiles(user_id) on delete cascade,
  label varchar(64),
  recipient_name varchar(120),
  phone varchar(32),
  region varchar(64),
  district varchar(100),
  address text not null,
  note text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  is_primary boolean default false
);

create table if not exists consumer_orders (
  order_id serial primary key,
  order_code varchar(48) unique not null,
  consumer_id uuid references profiles(user_id) on delete set null,
  outlet_id int references outlets(outlet_id) on delete cascade,
  product_id int references products(product_id),
  order_option varchar(24) not null, -- refill, tradein, perdana
  delivery_method varchar(24) not null, -- delivery, pickup
  delivery_address text,
  quantity int not null,
  unit_price numeric(12,2) not null,
  delivery_fee numeric(12,2) default 0,
  total_amount numeric(12,2) not null,
  payment_method varchar(32) default 'COD',
  status varchar(32) default 'Sedang Diproses Kurir',
  created_at timestamptz default now()
);

create table if not exists sales (
  sales_id serial primary key,
  outlet_id int references outlets(outlet_id) on delete cascade,
  agent_id int references agents(agent_id) on delete set null,
  sales_date date not null default current_date,
  buyer_name varchar(150),
  source varchar(48) default 'Toko Fisik / Walk-in',
  total_sales numeric(14,2) not null default 0,
  created_at timestamptz default now()
);

create table if not exists sales_detail (
  sales_detail_id serial primary key,
  sales_id int references sales(sales_id) on delete cascade,
  product_id int references products(product_id),
  quantity int not null,
  unit_price numeric(12,2) not null,
  subtotal numeric(14,2) not null
);

create table if not exists notifications (
  notification_id serial primary key,
  user_id uuid references profiles(user_id) on delete cascade,
  category varchar(64),
  sender varchar(120),
  title varchar(200) not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security (RLS) sesuai standar ISO 27001
alter table profiles enable row level security;
alter table agents enable row level security;
alter table outlets enable row level security;
alter table outlet_stock enable row level security;
alter table warehouse_stock enable row level security;
alter table consumer_orders enable row level security;
alter table sales enable row level security;

-- Kebijakan akses publik untuk katalog peta & stok outlet aktif
create policy "Public read active agents" on agents for select using (status = 'Valid');
create policy "Public read active outlets" on outlets for select using (account_status = 'Aktif');
create policy "Public read outlet stock" on outlet_stock for select using (true);
