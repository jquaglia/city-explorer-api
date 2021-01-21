DROP TABLE location;
DROP TABLE weather;
DROP TABLE parks;

CREATE TABLE location(
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6)
);

CREATE TABLE weather(
  id SERIAL PRIMARY KEY,
  forecast VARCHAR(255),
  time VARCHAR(255)
);

CREATE TABLE parks(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255),
  fee VARCHAR(255),
  description VARCHAR(255),
  url VARCHAR(255)
);