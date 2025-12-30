# PostgreSQL Analytics Queries

This document contains example SQL queries for the LMS analytics database.

## Database Schema

The analytics database consists of three main tables:

1. **course_analytics** - Course-level statistics
2. **quiz_analytics** - Quiz performance metrics
3. **student_performance** - Individual student performance records

## Example Queries

### 1. Get Total Enrollments Per Course

```sql
SELECT 
    course_id,
    total_enrollments,
    total_completions,
    average_progress,
    ROUND((total_completions::DECIMAL / NULLIF(total_enrollments, 0)) * 100, 2) AS completion_rate
FROM course_analytics
ORDER BY total_enrollments DESC;
```

### 2. Get Quiz Performance Summary

```sql
SELECT 
    qa.quiz_id,
    qa.course_id,
    qa.total_submissions,
    qa.average_score,
    qa.pass_rate,
    CASE 
        WHEN qa.pass_rate >= 80 THEN 'Excellent'
        WHEN qa.pass_rate >= 60 THEN 'Good'
        WHEN qa.pass_rate >= 40 THEN 'Fair'
        ELSE 'Needs Improvement'
    END AS performance_category
FROM quiz_analytics qa
ORDER BY qa.average_score DESC;
```

### 3. Get Student Performance by Course

```sql
SELECT 
    sp.student_id,
    sp.course_id,
    COUNT(DISTINCT sp.quiz_id) AS quizzes_taken,
    AVG(sp.score) AS average_quiz_score,
    COUNT(CASE WHEN sp.completed = true THEN 1 END) AS quizzes_completed
FROM student_performance sp
WHERE sp.course_id = 'your_course_id'
GROUP BY sp.student_id, sp.course_id
ORDER BY average_quiz_score DESC;
```

### 4. Get Top Performing Courses

```sql
SELECT 
    ca.course_id,
    ca.total_enrollments,
    ca.total_completions,
    ca.average_progress,
    ROUND((ca.total_completions::DECIMAL / NULLIF(ca.total_enrollments, 0)) * 100, 2) AS completion_rate
FROM course_analytics ca
WHERE ca.total_enrollments > 10
ORDER BY completion_rate DESC, ca.average_progress DESC
LIMIT 10;
```

### 5. Get Quiz Statistics for All Courses

```sql
SELECT 
    qa.course_id,
    COUNT(qa.quiz_id) AS total_quizzes,
    SUM(qa.total_submissions) AS total_quiz_submissions,
    AVG(qa.average_score) AS avg_quiz_score,
    AVG(qa.pass_rate) AS avg_pass_rate
FROM quiz_analytics qa
GROUP BY qa.course_id
ORDER BY total_quiz_submissions DESC;
```

### 6. Get Student Progress Over Time

```sql
SELECT 
    DATE(created_at) AS date,
    COUNT(DISTINCT student_id) AS active_students,
    AVG(score) AS average_score,
    COUNT(*) AS total_submissions
FROM student_performance
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 7. Get Courses with Low Completion Rates

```sql
SELECT 
    course_id,
    total_enrollments,
    total_completions,
    ROUND((total_completions::DECIMAL / NULLIF(total_enrollments, 0)) * 100, 2) AS completion_rate
FROM course_analytics
WHERE (total_completions::DECIMAL / NULLIF(total_enrollments, 0)) * 100 < 50
    AND total_enrollments > 5
ORDER BY completion_rate ASC;
```

### 8. Get Quiz Difficulty Analysis

```sql
SELECT 
    quiz_id,
    total_submissions,
    average_score,
    pass_rate,
    CASE 
        WHEN average_score >= 80 THEN 'Easy'
        WHEN average_score >= 60 THEN 'Medium'
        ELSE 'Hard'
    END AS difficulty_level
FROM quiz_analytics
ORDER BY average_score ASC;
```

### 9. Get Student Performance Distribution

```sql
SELECT 
    CASE 
        WHEN score >= 90 THEN 'A (90-100)'
        WHEN score >= 80 THEN 'B (80-89)'
        WHEN score >= 70 THEN 'C (70-79)'
        WHEN score >= 60 THEN 'D (60-69)'
        ELSE 'F (Below 60)'
    END AS grade_range,
    COUNT(*) AS student_count,
    ROUND(AVG(score), 2) AS average_score
FROM student_performance
WHERE quiz_id = 'your_quiz_id'
GROUP BY grade_range
ORDER BY MIN(score) DESC;
```

### 10. Get Instructor Dashboard Summary

```sql
SELECT 
    COUNT(DISTINCT ca.course_id) AS total_courses,
    SUM(ca.total_enrollments) AS total_enrollments,
    SUM(ca.total_completions) AS total_completions,
    ROUND(AVG(ca.average_progress), 2) AS overall_avg_progress,
    COUNT(DISTINCT qa.quiz_id) AS total_quizzes,
    ROUND(AVG(qa.average_score), 2) AS overall_avg_quiz_score
FROM course_analytics ca
LEFT JOIN quiz_analytics qa ON ca.course_id = qa.course_id;
```

### 11. Update Course Analytics (Trigger Example)

```sql
-- This would typically be called from the application
-- Example: Update enrollments
UPDATE course_analytics
SET 
    total_enrollments = total_enrollments + 1,
    updated_at = CURRENT_TIMESTAMP
WHERE course_id = 'your_course_id';
```

### 12. Get Recent Activity

```sql
SELECT 
    'quiz_submission' AS activity_type,
    quiz_id AS activity_id,
    student_id,
    score,
    created_at
FROM student_performance
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;
```

## Performance Optimization

### Create Indexes for Better Performance

```sql
-- Additional indexes for common queries
CREATE INDEX idx_student_performance_created_at ON student_performance(created_at);
CREATE INDEX idx_course_analytics_updated_at ON course_analytics(updated_at);
CREATE INDEX idx_quiz_analytics_course_id_score ON quiz_analytics(course_id, average_score);
```

### View for Course Summary

```sql
CREATE OR REPLACE VIEW course_summary AS
SELECT 
    ca.course_id,
    ca.total_enrollments,
    ca.total_completions,
    ca.average_progress,
    COUNT(qa.quiz_id) AS quiz_count,
    COALESCE(SUM(qa.total_submissions), 0) AS total_quiz_submissions,
    COALESCE(ROUND(AVG(qa.average_score), 2), 0) AS avg_quiz_score
FROM course_analytics ca
LEFT JOIN quiz_analytics qa ON ca.course_id = qa.course_id
GROUP BY ca.course_id, ca.total_enrollments, ca.total_completions, ca.average_progress;
```

Usage:
```sql
SELECT * FROM course_summary WHERE course_id = 'your_course_id';
```

## Notes

- All timestamps are stored in UTC
- Use parameterized queries in the application to prevent SQL injection
- Consider adding materialized views for complex analytics queries
- Regular VACUUM and ANALYZE operations are recommended for optimal performance

