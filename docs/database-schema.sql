CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE pregnancy_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INT NOT NULL,
  pregnancy_week INT NOT NULL,
  trimester INT NOT NULL,
  diet_preference VARCHAR(20) NOT NULL,
  allergies TEXT NOT NULL DEFAULT '',
  medical_conditions TEXT NOT NULL DEFAULT '',
  doctor_restrictions TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE scan_records (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scan_type VARCHAR(30) NOT NULL,
  input_value TEXT NOT NULL,
  detected_food VARCHAR(255) NOT NULL,
  ingredients JSONB NOT NULL,
  nutrients JSONB NOT NULL,
  additives JSONB NOT NULL,
  classification VARCHAR(20) NOT NULL,
  explanation TEXT NOT NULL,
  rule_hits JSONB NOT NULL,
  alternatives JSONB NOT NULL,
  references JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE favorite_foods (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_name VARCHAR(255) NOT NULL,
  last_classification VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
