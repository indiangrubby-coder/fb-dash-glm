-- Facebook Ads Dashboard Schema for Neon PostgreSQL
-- Run this in your Neon database after creating the project

-- Enable UUID extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_telegram TEXT,
    business_manager_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad accounts table
CREATE TABLE IF NOT EXISTS ad_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    vendor_id TEXT REFERENCES vendors(id),
    business_manager_id TEXT,
    status TEXT,
    currency TEXT,
    timezone TEXT,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Account metrics table
CREATE TABLE IF NOT EXISTS account_metrics (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_account_id TEXT NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    spend DECIMAL(10,2),
    spend_cap DECIMAL(10,2),
    clicks INTEGER,
    impressions INTEGER,
    cpc DECIMAL(10,4),
    balance DECIMAL(10,2),
    status_at_fetch TEXT,
    fetched_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ad_account_id, date)
);

-- Account actions (audit log) table
CREATE TABLE IF NOT EXISTS account_actions (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    performed_by TEXT NOT NULL,
    ad_account_id TEXT NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
    target_type TEXT,
    target_id TEXT,
    action TEXT NOT NULL,
    payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ad_accounts_vendor_id ON ad_accounts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_account_metrics_ad_account_id ON account_metrics(ad_account_id);
CREATE INDEX IF NOT EXISTS idx_account_metrics_date ON account_metrics(date);
CREATE INDEX IF NOT EXISTS idx_account_actions_ad_account_id ON account_actions(ad_account_id);
CREATE INDEX IF NOT EXISTS idx_account_actions_performed_by ON account_actions(performed_by);

-- Create updated_at trigger function (optional, for automatic timestamp updates)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_accounts_updated_at BEFORE UPDATE ON ad_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();