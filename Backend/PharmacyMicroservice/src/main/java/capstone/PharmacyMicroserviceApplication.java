package capstone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PharmacyMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PharmacyMicroserviceApplication.class, args);
	}

}
