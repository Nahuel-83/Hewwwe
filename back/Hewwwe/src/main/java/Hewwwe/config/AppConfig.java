package Hewwwe.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class for the Hewwwe application.
 * <p>
 * This class provides application-level beans such as {@link ModelMapper} and
 * custom OpenAPI documentation.
 */
@Configuration
@OpenAPIDefinition
public class AppConfig {

    /**
     * Creates and configures a {@link ModelMapper} bean.
     * <p>
     * ModelMapper is used to convert between DTOs and entity classes.
     *
     * @return a configured instance of {@link ModelMapper}
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /**
     * Sets up the custom OpenAPI documentation for the API.
     * <p>
     * This includes metadata such as the title, version, and description of the API.
     *
     * @return an {@link OpenAPI} instance with custom information
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hewwwe API")
                        .version("1.0")
                        .description("API for the second-hand clothing marketplace"));
    }
}
