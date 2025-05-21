/**
 * Main package of the application
 */
package Hewwwe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main class of the Spring Boot application
 * This class starts the application and configures the Spring context
 * 
 * @SpringBootApplication indicates that this is a Spring Boot application
 * scanBasePackages defines the base package for component scanning
 */
@SpringBootApplication(scanBasePackages = "Hewwwe")
public class HewwweApplication {
    /**
     * Main method that starts the Spring Boot application
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(HewwweApplication.class, args);
    }
}
