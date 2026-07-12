-- =====================================================
-- ESG MANAGEMENT PLATFORM DATABASE SCHEMA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DEPARTMENTS
-- =====================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    head VARCHAR(100) NOT NULL,

    parent_department_id UUID,

    employee_count INTEGER DEFAULT 0 CHECK (employee_count >= 0),

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Active','Inactive')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE departments
ADD CONSTRAINT fk_parent_department
FOREIGN KEY (parent_department_id)
REFERENCES departments(id)
ON DELETE SET NULL;

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    type VARCHAR(30) NOT NULL
        CHECK (type IN ('CSR Activity','Challenge')),

    status VARCHAR(20) NOT NULL
        CHECK (status IN ('Active','Inactive')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EMISSION FACTORS
-- =====================================================

CREATE TABLE emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    carbon_value DECIMAL(10,2) NOT NULL
        CHECK (carbon_value >= 0),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- BADGES
-- =====================================================

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    description TEXT,

    unlock_rule TEXT,

    icon_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REWARDS
-- =====================================================

CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(100) NOT NULL,

    description TEXT,

    points_required INTEGER NOT NULL
        CHECK (points_required >= 0),

    stock INTEGER DEFAULT 0
        CHECK (stock >= 0),

    status VARCHAR(20)
        CHECK (status IN ('Active','Inactive')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CARBON TRANSACTIONS
-- =====================================================

CREATE TABLE carbon_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    source VARCHAR(100) NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    calculated_emissions DECIMAL(12,2) NOT NULL,

    transaction_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CSR ACTIVITIES
-- =====================================================

CREATE TABLE csr_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(150) NOT NULL,

    joined_count INTEGER DEFAULT 0,

    evidence_required BOOLEAN DEFAULT FALSE,

    status VARCHAR(20)
        CHECK (status IN ('Open','Closed')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EMPLOYEE PARTICIPATION
-- =====================================================

CREATE TABLE employee_participation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id VARCHAR(50) NOT NULL,

    employee_name VARCHAR(150) NOT NULL,

    activity_id UUID NOT NULL,

    proof_url TEXT,

    approval_status VARCHAR(20)
        CHECK (approval_status IN ('Pending','Approved','Rejected')),

    points_earned INTEGER DEFAULT 0,

    completion_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_activity
        FOREIGN KEY (activity_id)
        REFERENCES csr_activities(id)
        ON DELETE CASCADE
);

-- =====================================================
-- CHALLENGES
-- =====================================================

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(150) NOT NULL,

    category VARCHAR(100),

    description TEXT,

    xp INTEGER DEFAULT 0,

    difficulty VARCHAR(20)
        CHECK (difficulty IN ('Easy','Medium','Hard')),

    evidence_required BOOLEAN DEFAULT FALSE,

    deadline DATE,

    status VARCHAR(30)
        CHECK (
            status IN (
                'Draft',
                'Active',
                'Under Review',
                'Completed',
                'Archived'
            )
        ),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AUDITS
-- =====================================================

CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(150) NOT NULL,

    department_id UUID NOT NULL,

    auditor VARCHAR(100) NOT NULL,

    audit_date DATE NOT NULL,

    findings TEXT,

    status VARCHAR(30)
        CHECK (status IN ('Completed','Under Review')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);

-- =====================================================
-- COMPLIANCE ISSUES
-- =====================================================

CREATE TABLE compliance_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    audit_id UUID NOT NULL,

    issue_description TEXT NOT NULL,

    severity VARCHAR(20)
        CHECK (severity IN ('Low','Medium','High')),

    department_id UUID NOT NULL,

    owner VARCHAR(100),

    due_date DATE,

    status VARCHAR(20)
        CHECK (status IN ('Open','Resolved')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_issue_audit
        FOREIGN KEY (audit_id)
        REFERENCES audits(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_issue_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);

-- =====================================================
-- DEPARTMENT SCORES
-- =====================================================

CREATE TABLE department_scores (

    department_id UUID PRIMARY KEY,

    environmental_score DECIMAL(5,2) DEFAULT 0,

    social_score DECIMAL(5,2) DEFAULT 0,

    governance_score DECIMAL(5,2) DEFAULT 0,

    total_score DECIMAL(5,2) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_department_score
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_department_parent
ON departments(parent_department_id);

CREATE INDEX idx_participation_activity
ON employee_participation(activity_id);

CREATE INDEX idx_audit_department
ON audits(department_id);

CREATE INDEX idx_issue_audit
ON compliance_issues(audit_id);

CREATE INDEX idx_issue_department
ON compliance_issues(department_id);

CREATE INDEX idx_carbon_transaction_date
ON carbon_transactions(transaction_date);

CREATE INDEX idx_challenge_deadline
ON challenges(deadline);

CREATE INDEX idx_audit_date
ON audits(audit_date);
