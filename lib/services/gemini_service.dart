import 'dart:convert';
import 'package:http/http.dart' as http;

class GeminiService {
  final String apiKey;

  GeminiService(this.apiKey);

  Future<String> translate(String text, String targetLanguage) async {
    final response = await http.post(
      Uri.parse('https://gemini.googleapis.com/v1beta/models/gemini-3:generateContent'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "prompt": "Translate the following text to $targetLanguage:\n$text",
        "maxOutputTokens": 500,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Adjust depending on Gemini response structure
      return data['candidates'][0]['output'] ?? '';
    } else {
      throw Exception('Failed to translate: ${response.body}');
    }
  }
}
