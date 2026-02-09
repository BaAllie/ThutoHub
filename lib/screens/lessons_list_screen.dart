import 'package:flutter/material.dart';
<<<<<<< HEAD

import '../models/lesson.dart';
import '../services/supabase_service.dart';
import 'lesson_detail_screen.dart';

class LessonsListScreen extends StatefulWidget {
  const LessonsListScreen({super.key});

  @override
  State<LessonsListScreen> createState() => _LessonsListScreenState();
}

class _LessonsListScreenState extends State<LessonsListScreen> {
  late Future<List<Lesson>> _lessonsFuture;
=======
import '../lib/supabase_client.dart';
import '../lib/lesson_detail_screen.dart';

class LessonListScreen extends StatefulWidget {
  final String geminiKey;
  const LessonListScreen({super.key, required this.geminiKey});

  @override
  State<LessonListScreen> createState() => _LessonListScreenState();
}

class _LessonListScreenState extends State<LessonListScreen> {
  bool loading = true;
  List<Map<String, dynamic>> lessons = [];
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67

  @override
  void initState() {
    super.initState();
<<<<<<< HEAD
    _lessonsFuture = SupabaseService.fetchLessons();
  }

  Future<void> _refreshLessons() async {
    setState(() {
      _lessonsFuture = SupabaseService.fetchLessons();
    });
=======
    loadLessons();
  }

  Future<void> loadLessons() async {
    setState(() {
      loading = true;
    });
    try {
      final fetched = await SupabaseClientWrapper.fetchLessons(
        grade: 'Grade 4',
        subject: 'Mathematics',
      );
      setState(() {
        lessons = fetched;
      });
    } catch (e) {
      print('Error loading lessons: $e');
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  void navigateToLesson(Map<String, dynamic> lesson) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => LessonDetailScreen(
          lessonId: lesson['id'] as String,
          geminiKey: widget.geminiKey,
        ),
      ),
    );
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
<<<<<<< HEAD
      appBar: AppBar(
        title: const Text('Lessons List'),
      ),
      body: RefreshIndicator(
        onRefresh: _refreshLessons,
        child: FutureBuilder<List<Lesson>>(
          future: _lessonsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Error loading lessons',
                        style: TextStyle(fontSize: 18, color: Colors.red),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        snapshot.error.toString(),
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.redAccent),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _refreshLessons,
                        child: const Text('Try Again'),
                      ),
                    ],
                  ),
                ),
              );
            }

            if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(
                child: Text(
                  'No lessons found.',
                  style: TextStyle(fontSize: 18, color: Colors.grey),
                ),
              );
            }

            final lessons = snapshot.data!;

            return ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: lessons.length,
              itemBuilder: (context, index) {
                final lesson = lessons[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: const Icon(Icons.school, color: Colors.blue),
                    title: Text(
                      lesson.title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      lesson.description ?? 'No description available',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => LessonDetailScreen(
                            lesson: lesson,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
=======
      appBar: AppBar(title: const Text('Grade 4 Maths Lessons')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : lessons.isEmpty
              ? const Center(child: Text('No lessons found'))
              : ListView.builder(
                  itemCount: lessons.length,
                  itemBuilder: (context, index) {
                    final lesson = lessons[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      child: ListTile(
                        title: Text(lesson['title'] as String),
                        subtitle: Text(lesson['learning_objective'] ?? ''),
                        trailing: const Icon(Icons.arrow_forward_ios),
                        onTap: () => navigateToLesson(lesson),
                      ),
                    );
                  },
                ),
    );
  }
}
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
