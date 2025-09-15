# Stage 1: Build the application with Maven to create the JAR file
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Create the final, smaller runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy only the built JAR from the 'build' stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your app runs on
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]