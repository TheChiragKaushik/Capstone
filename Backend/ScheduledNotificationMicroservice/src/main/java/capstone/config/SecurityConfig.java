//package capstone.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//
//import io.netty.handler.codec.http.HttpMethod;
//
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//	
//	@Bean
//	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//	
//		http
//		   .csrf(csrf -> csrf.disable())
//		   .authorizeHttpRequests(auth -> auth
//				   .requestMatchers(
//						   "/ws/**", 
//						   "/app/**", 
//						   "/topic/**", 
//						   "/queue/**", 
//						   "/user/**",
//						   "/ws/info/**",
//						   HttpMethod.OPTIONS.name()).permitAll()
//				   .anyRequest().authenticated()
//			)
//		   .httpBasic(Customizer.withDefaults());
//		
//		return http.build();
//	}
//
//}
