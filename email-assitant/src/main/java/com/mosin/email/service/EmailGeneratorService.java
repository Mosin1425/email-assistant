package com.mosin.email.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.mosin.email.dto.EmailRequestDto;

import io.micrometer.common.util.StringUtils;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class EmailGeneratorService {
	
	@Value("${gemini.api.url}")
	private String geminiApiUrl;
	
	@Value("${gemini.api.key}")
	private String geminiApiKey;

	public ResponseEntity<Object> generateEmailContent(EmailRequestDto emailRequestDto) {
		String promt = buildPromt(emailRequestDto);
		
		String s = callGemeni(promt);
		return null;
	
	}

	private String buildPromt(EmailRequestDto emailRequestDto) {
		StringBuilder prompt = new StringBuilder();
		
		prompt.append("Genereate a professional email reply for the following email content."
				+ " Please don't generate email subject line ");
		
		if(StringUtils.isNotEmpty(emailRequestDto.getTone())) {
			prompt.append("Use a ").append(emailRequestDto.getTone()).append(" tone.");
		}
		prompt.append("\n Original email:- \n").append(emailRequestDto.getEmailContent());
		return null;
	}
	
	private String callGemeni(String promt) {
		try {
			OkHttpClient client = new OkHttpClient().newBuilder()
					  .build();
					MediaType mediaType = MediaType.parse("application/json");
					RequestBody body = RequestBody.create(mediaType,
							"{\r\n    \"contents\": "
							+ "[\r\n      {\r\n        \"parts\": [\r\n          {\r\n            "
							+ "\"text\": \"Explain how AI works in detail\"\r\n          }\r\n        ]\r\n      "
							+ "}\r\n    ]\r\n  }");
					Request request = new Request.Builder()
					  .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC1mBd-bi9dsI4772DezboWArHnwlrrWKQ")
					  .method("POST", body)
					  .addHeader("Content-Type", "application/json")
					  .build();
					Response response = client.newCall(request).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}
}
