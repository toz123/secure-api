DROP DATABASE IF EXISTS "armoney-dev";
DROP USER IF EXISTS "armoney-dev";
CREATE DATABASE "armoney-dev";
CREATE USER "armoney-dev" WITH PASSWORD 'armoney-dev';
GRANT ALL PRIVILEGES ON DATABASE "armoney-dev" TO "armoney-dev";

DROP DATABASE IF EXISTS "armoney-test";
DROP USER IF EXISTS "armoney-test";
CREATE DATABASE "armoney-test";
CREATE USER "armoney-test" WITH PASSWORD 'armoney-test';
GRANT ALL PRIVILEGES ON DATABASE "armoney-test" TO "armoney-test";