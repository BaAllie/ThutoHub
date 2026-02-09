<<<<<<< HEAD
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

import '../models/lesson.dart';
import '../main.dart'; // imports generativeModel

class SupabaseService {
  static Future<List<Lesson>> fetchLessons() async {
    try {
      final response = await Supabase.instance.client
          .from('lessons')
          .select()
          .order('id', ascending: true);

      if (kDebugMode) {
        debugPrint('Supabase raw response: $response');
        debugPrint('Number of rows: ${response.length}');
      }

      if (response.isEmpty) {
        if (kDebugMode) {
          debugPrint('No lessons returned from Supabase. Check: RLS policies, table name, or data existence.');
        }
      }

      final rawLessons = (response as List<dynamic>)
          .map((json) => Lesson.fromJson(json as Map<String, dynamic>))
          .toList();

      // Enhance each lesson with Gemini AI
      final enhancedLessons = <Lesson>[];
      for (var lesson in rawLessons) {
        final enhanced = await _enhanceLesson(lesson);
        enhancedLessons.add(enhanced);
      }

      return enhancedLessons;
    } on PostgrestException catch (e) {
      if (kDebugMode) {
        debugPrint('PostgrestException in fetchLessons: ${e.message}');
        debugPrint('Details: ${e.details}');
        debugPrint('Hint: ${e.hint}');
      }
      rethrow;
    } catch (e, stackTrace) {
      if (kDebugMode) {
        debugPrint('Error fetching lessons: $e');
        debugPrint('Stack trace: $stackTrace');
      }
      rethrow;
    }
  }

  static Future<Lesson> _enhanceLesson(Lesson lesson) async {
    try {
      final prompt = '''
From this lesson content, generate:
1. A list of 3-5 quiz questions (multiple choice with 4 options each, 1 correct answer marked clearly).
2. A simplified explanation (for beginners, max 150 words).
3. 2-3 key takeaways in bullet points.

Return ONLY the generated content in this format:

Quiz Questions:
[question 1]
A) option
B) option
C) option
D) option
Correct: B

[question 2]...

Simplified Explanation:
[your simplified text here]

Key Takeaways:
- point 1
- point 2
- point 3

Lesson content:
Title: ${lesson.title}
Body: ${lesson.body ?? 'N/A'}
Learning Objectives: ${lesson.learningObjectives?.join("\n") ?? 'N/A'}
Key Concepts: ${lesson.keyConcepts?.join("\n") ?? 'N/A'}
Simple Explanation: ${lesson.simpleExplanation ?? 'N/A'}
Activities: ${lesson.activities?.join("\n") ?? 'N/A'}
Teacher's Notes: ${lesson.teachersNote ?? 'N/A'}
''';

      final response = await generativeModel.generateContent([
        Content.text(prompt),
      ]);

      final enhancedText = response.text ?? '';

      if (enhancedText.trim().isEmpty) {
        if (kDebugMode) debugPrint('No enhancement received for lesson ${lesson.id}');
        return lesson; // fallback
      }

      // Extract quiz (you can expand this parsing later)
      String quiz = '';
      if (enhancedText.contains('Quiz Questions:')) {
        quiz = enhancedText.split('Quiz Questions:')[1].split('Simplified Explanation:')[0].trim();
      }

      // Extract simplified explanation (optional - can be used later)
      String simplified = '';
      if (enhancedText.contains('Simplified Explanation:')) {
        simplified = enhancedText.split('Simplified Explanation:')[1].split('Key Takeaways:')[0].trim();
      }

      return Lesson(
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        body: lesson.body,
        learningObjectives: lesson.learningObjectives,
        keyConcepts: lesson.keyConcepts,
        simpleExplanation: simplified.isNotEmpty ? simplified : lesson.simpleExplanation,
        activities: lesson.activities,
        teachersNote: lesson.teachersNote,
        quiz: quiz,  // ← now used! No more unused variable warning
      );
    } catch (e) {
      if (kDebugMode) debugPrint('AI enhancement failed for lesson ${lesson.id}: $e');
      return lesson; // fallback to original
    }
  }
=======
import 'package:supabase_flutter/supabase_flutter.dart';

// Optional: define a simple model if you want cleaner code later
// class Lesson {
//   final String id;
//   final String title;
//   final String grade;
//   final String subject;
//   // ... other fields

//   Lesson.fromJson(Map<String, dynamic> json)
//       : id = json['id'],
//         title = json['title'],
//         grade = json['grade'],
//         subject = json['subject'];
// }

class SupabaseServiceWrapper {
  // No need for your own _client variable – use Supabase.instance.client

  static void initialize(String url, String anonKey) async {
    await Supabase.initialize(
      url: url,
      anonKey: anonKey,
      // Optional: debug: true,  // useful during dev
      // authOptions: ... if you need custom auth flow
    );
  }

  static SupabaseClient get client => Supabase.instance.client;

  /// Fetches lessons filtered by grade and subject
  static Future<List<Map<String, dynamic>>> fetchLessons({
    required String grade,
    required String subject,
  }) async {
    try {
      final response = await client
          .from('lessons')  // ← change table name if different
          .select()         // selects all columns; or .select('id, title, content')
          .eq('grade', grade)
          .eq('subject', subject)
          .order('created_at', ascending: false); // optional: sort by newest

      print('Fetched ${response.length} lessons');
      return response;
    } on PostgrestException catch (e) {
      print('Postgrest error: ${e.message} (code: ${e.code})');
      if (e.code == 'PGRST116') {
        // No rows found – that's fine, return empty list
        return [];
      }
      rethrow; // or return [] / show user-friendly error
    } catch (e) {
      print('Unexpected error fetching lessons: $e');
      rethrow;
    }
  }

  // Example: If you later want to fetch a single lesson by ID
  static Future<Map<String, dynamic>?> getLessonById(String id) async {
    try {
      final response = await client
          .from('lessons')
          .select()
          .eq('id', id)
          .maybeSingle(); // returns null if not found

      return response;
    } on PostgrestException catch (e) {
      print('Error fetching lesson: ${e.message}');
      return null;
    }
  }

  // Add more methods as needed (insert, update, delete, realtime, auth, etc.)
  // Example insert:
  // static Future<void> addLesson(Map<String, dynamic> lessonData) async {
  //   await client.from('lessons').insert(lessonData);
  // }
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
}