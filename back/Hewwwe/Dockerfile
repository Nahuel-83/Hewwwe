# STEP 1/2 - Maven Build
FROM maven:3.9.6-eclipse-temurin-21 as build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# STEP 2/2 - Build Docker Image with JDK 21
FROM eclipse-temurin:21-jdk as runtime

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]