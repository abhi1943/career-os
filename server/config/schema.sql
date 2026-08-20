-- ======================================================
-- CareerOS Database Schema
-- ======================================================
-- STEP 20.2 — Persistent Database
-- ======================================================

CREATE DATABASE IF NOT EXISTS career_os;

USE career_os;


-- ======================================================
-- JOB ALERTS
-- ======================================================

CREATE TABLE IF NOT EXISTS job_alerts (
    id VARCHAR(100) PRIMARY KEY,

    user_id VARCHAR(100) NOT NULL,

    keyword VARCHAR(100) NOT NULL,

    location VARCHAR(100) NOT NULL DEFAULT 'India',

    experience VARCHAR(100) NOT NULL DEFAULT 'Any Experience',

    job_type VARCHAR(100) NOT NULL DEFAULT 'Any Type',

    work_mode VARCHAR(100) NOT NULL DEFAULT 'Any',

    salary VARCHAR(100) NOT NULL DEFAULT 'Any Salary',

    frequency ENUM(
        'Instant',
        'Daily',
        'Weekly'
    ) NOT NULL DEFAULT 'Daily',

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    search_key VARCHAR(600) NOT NULL,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    last_matched_at DATETIME NULL,

    match_count INT NOT NULL DEFAULT 0,

    matched_job_ids JSON NULL,

    UNIQUE KEY unique_user_alert (
        user_id,
        search_key
    ),

    INDEX idx_job_alerts_user (
        user_id
    ),

    INDEX idx_job_alerts_active (
        user_id,
        enabled,
        active
    )
);


-- ======================================================
-- SAVED JOBS
-- ======================================================

CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id VARCHAR(100) NOT NULL,

    job_id VARCHAR(255) NOT NULL,

    title VARCHAR(500),

    company VARCHAR(255),

    location VARCHAR(255),

    description TEXT,

    url TEXT,

    salary VARCHAR(255),

    job_type VARCHAR(100),

    work_mode VARCHAR(100),

    experience VARCHAR(100),

    category VARCHAR(255),

    skills JSON NULL,

    job_data JSON NULL,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    UNIQUE KEY unique_user_saved_job (
        user_id,
        job_id
    ),

    INDEX idx_saved_jobs_user (
        user_id
    ),

    INDEX idx_saved_jobs_job (
        job_id
    )
);


-- ======================================================
-- SEARCH HISTORY
-- ======================================================

CREATE TABLE IF NOT EXISTS search_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id VARCHAR(100) NOT NULL,

    query VARCHAR(255) NOT NULL,

    location VARCHAR(255),

    experience VARCHAR(100),

    job_type VARCHAR(100),

    work_mode VARCHAR(100),

    salary VARCHAR(100),

    result_count INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL,

    updated_at DATETIME NOT NULL,

    INDEX idx_search_history_user (
        user_id
    ),

    INDEX idx_search_history_created (
        user_id,
        created_at
    )
);


-- ======================================================
-- VERIFY TABLES
-- ======================================================

SHOW TABLES;