FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

COPY apps/engine-java/build.gradle apps/engine-java/settings.gradle ./
COPY apps/engine-java/src ./src

RUN ./gradlew build -x test

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=builder /app/build/libs/*.jar ./app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
