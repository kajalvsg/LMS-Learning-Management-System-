-- PostgreSQL Schema for LMS Analytics

CREATE TABLE IF NOT EXISTS course_analytics (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    average_progress DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id)
);

CREATE TABLE IF NOT EXISTS quiz_analytics (
    id SERIAL PRIMARY KEY,
    quiz_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    total_submissions INTEGER DEFAULT 0,
    average_score DECIMAL(5, 2) DEFAULT 0.00,
    pass_rate DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quiz_id)
);

CREATE TABLE IF NOT EXISTS student_performance (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    quiz_id VARCHAR(255),
    score DECIMAL(5, 2),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_analytics_course_id ON course_analytics(course_id);
CREATE INDEX idx_quiz_analytics_quiz_id ON quiz_analytics(quiz_id);
CREATE INDEX idx_quiz_analytics_course_id ON quiz_analytics(course_id);
CREATE INDEX idx_student_performance_student_id ON student_performance(student_id);
CREATE INDEX idx_student_performance_course_id ON student_performance(course_id);

