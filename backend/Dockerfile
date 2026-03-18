# Dockerfile para ENEBA Backend
# Usa Maven para compilar, luego ejecuta con Java

# Etapa 1: Compilar con Maven
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiar pom.xml
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar
RUN mvn clean package -DskipTests

# Etapa 2: Ejecutar con Java
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copiar JAR compilado desde la etapa anterior
COPY --from=builder /app/target/eneba-clone-1.0.0.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar
ENTRYPOINT ["java", "-jar", "app.jar"]
