package capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.services.PatientNotificationsService;


@Controller
@RestController
@RequestMapping("/api/scheduled")
public class ScheduledNotificationController { 
    
	@Autowired
    private PatientNotificationsService patientNotificationsServiceRef;
	
	
	@GetMapping("/schedule")
	public void sendNotifications() {
		patientNotificationsServiceRef.scheduleDailyNotifications();
		System.out.println("Notifications sent successfully.");
	}
	
	

}


