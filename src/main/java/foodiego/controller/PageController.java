package foodiego.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

	@GetMapping("/auth/login")
	public String showLoginPage() {
		return "login";
	}
	
	@GetMapping("/auth/register")
    public String showRegisterPage() {
        return "register"; // templates/register.html
    }
}
