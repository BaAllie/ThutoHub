import 'package:flutter/material.dart';
<<<<<<< HEAD

import 'lessons_list_screen.dart';  // Import the list screen

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
=======
import 'package:thutohub/services/gemini_service.dart';
import 'package:thutohub/services/supabase_service.dart';

class HomeScreen extends StatefulWidget {
  final String geminiKey;
  const HomeScreen({super.key, required this.geminiKey});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late GeminiService gemini;
  String translatedText = '';
  bool loading = false;

  @override
  void initState() {
    super.initState();
    gemini = GeminiService(widget.geminiKey);
  }

  Future<void> translateSample() async {
    setState(() {
      loading = true;
    });

    try {
      final text = 'Grade 4 Maths made easier';
      final result = await gemini.translate(text, 'isiZulu'); // Example translation
      setState(() {
        translatedText = result;
      });
    } catch (e) {
      setState(() {
        translatedText = 'Translation failed: $e';
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> loadLessons() async {
    try {
      final lessons = await SupabaseServiceWrapper.fetchLessons(
        grade: 'Grade 4',
        subject: 'Mathematics',
      );
      print('Fetched ${lessons.length} lessons');
      // You can navigate to lesson list screen here
    } catch (e) {
      print('Error fetching lessons: $e');
    }
  }
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67

  @override
  Widget build(BuildContext context) {
    return Scaffold(
<<<<<<< HEAD
      appBar: AppBar(
        title: const Text('ThutoHub'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo / icon placeholder
                const Icon(
                  Icons.school_rounded,
                  size: 120,
                  color: Colors.indigo,
                ),
                const SizedBox(height: 32),

                // Welcome text
                const Text(
                  'Welcome to ThutoHub',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),

                Text(
                  'Learn in your preferred South African language with AI-powered explanations',
                  style: TextStyle(
                    fontSize: 18,
                    color: Colors.grey[700],
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),

                // Main action button
                FilledButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const LessonsListScreen(),
                      ),
                    );
                  },
                  icon: const Icon(Icons.book_rounded),
                  label: const Text('Start Learning'),
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 48,
                      vertical: 20,
                    ),
                    textStyle: const TextStyle(fontSize: 18),
                  ),
                ),

                const SizedBox(height: 24),

                // Optional secondary button (e.g. about or settings)
                OutlinedButton.icon(
                  onPressed: () {
                    // Optional: show about dialog or settings
                    showAboutDialog(
                      context: context,
                      applicationName: 'ThutoHub',
                      applicationVersion: '1.0.0',
                      children: [
                        const Text('AI-powered lessons in South African languages'),
                      ],
                    );
                  },
                  icon: const Icon(Icons.info_outline),
                  label: const Text('About ThutoHub'),
                ),
              ],
            ),
=======
      appBar: AppBar(title: const Text('ThutoHub')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                translatedText.isEmpty ? 'Grade 4 Maths made easier' : translatedText,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loading ? null : translateSample,
                child: Text(loading ? 'Translating...' : 'Translate to isiZulu'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loadLessons,
                child: const Text('Load Lessons'),
              ),
            ],
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
          ),
        ),
      ),
    );
  }
}