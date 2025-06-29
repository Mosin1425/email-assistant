package com.mosin.email.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mosin.email.dto.EmailRequestDto;

@RestController
@RequestMapping("/api/email")
public class EmailGeneratorController {

	public ResponseEntity<Object> generateEmail(@RequestBody EmailRequestDto emailRequestDto) {
		return ResponseEntity.ok("All good");
	}
}
