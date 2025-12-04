-- Coach Platform Database Schema
-- PostgreSQL Database Schema

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;

-- Coaches Table
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    specialties TEXT[] NOT NULL, -- Array of specialties
    profile_image VARCHAR(500),
    years_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_coaches_specialties ON coaches USING GIN(specialties);
CREATE INDEX idx_messages_coach_id ON messages(coach_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_coaches_hourly_rate ON coaches(hourly_rate);

-- Sample data (optional, for testing)
-- You can remove this section if you don't want sample data
INSERT INTO coaches (email, password_hash, full_name, bio, hourly_rate, specialties, years_experience) VALUES
('ahmet.yilmaz@example.com', '$2b$10$rKjQz7qKN8xYHZxZ9Z9Z9.', 'Ahmet Yılmaz', 'Kariyer koçluğu alanında 10 yıllık deneyime sahip, profesyonel gelişim uzmanı.', 150.00, ARRAY['Kariyer', 'Liderlik', 'İş Hayatı'], 10),
('zeynep.kaya@example.com', '$2b$10$rKjQz7qKN8xYHZxZ9Z9Z9.', 'Zeynep Kaya', 'Yaşam koçu ve motivasyon uzmanı. Kişisel gelişim ve hedef belirleme konularında deneyimli.', 120.00, ARRAY['Yaşam Koçluğu', 'Motivasyon', 'Kişisel Gelişim'], 7),
('mehmet.demir@example.com', '$2b$10$rKjQz7qKN8xYHZxZ9Z9Z9.', 'Mehmet Demir', 'Fitness ve sağlıklı yaşam koçu. Spor psikolojisi ve beslenme danışmanlığı.', 100.00, ARRAY['Fitness', 'Sağlık', 'Spor'], 5);

