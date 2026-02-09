import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

import '../models/lesson.dart';
import '../main.dart'; // contains generativeModel

class LessonDetailScreen extends StatefulWidget {
  final Lesson lesson;

  const LessonDetailScreen({
    super.key,
    required this.lesson,
  });

  @override
  State<LessonDetailScreen> createState() => _LessonDetailScreenState();
}

class _LessonDetailScreenState extends State<LessonDetailScreen> {
  String _selectedLanguage = 'English';
  bool _isTranslating = false;
  String? _translationError;

  // Store translated content per section title
  final Map<String, String> _translatedSections = {};

  final List<String> _languages = [
    'English',
    'Afrikaans',
    'isiNdebele',
    'isiXhosa',
    'isiZulu',
    'Sepedi',
    'Sesotho',
    'Setswana',
    'siSwati',
    'Tshivenda',
    'Xitsonga',
  ];

  Lesson get displayLesson => widget.lesson;

  Future<void> _translateSection(String sectionTitle, String originalText) async {
    if (_selectedLanguage == 'English') {
      setState(() {
        _translatedSections.remove(sectionTitle);
      });
      return;
    }

    setState(() {
      _isTranslating = true;
      _translationError = null;
    });

    try {
      final prompt = '''
Translate the following text to $_selectedLanguage.
Keep the exact meaning, structure and formatting.
Use natural and correct language.
Do not add any extra explanations or commentary.

Text to translate:

$originalText
''';

      final response = await generativeModel.generateContent([
        Content.text(prompt),
      ]);

      final translated = response.text ?? '';

      if (translated.trim().isEmpty) {
        throw Exception("No translation received");
      }

      setState(() {
        _translatedSections[sectionTitle] = translated.trim();
      });
    } catch (e, stackTrace) {
      debugPrint('Translation error: $e\n$stackTrace');
      setState(() {
        _translationError = 'Translation failed: $e';
      });
    } finally {
      setState(() {
        _isTranslating = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lesson.title),
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
            child: DropdownButton<String>(
              value: _selectedLanguage,
              icon: const Icon(Icons.translate, color: Colors.white, size: 24),
              iconSize: 24,
              elevation: 16,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
              underline: Container(
                height: 2,
                color: Colors.white70,
              ),
              dropdownColor: Colors.blueGrey[900],
              borderRadius: BorderRadius.circular(12),
              isDense: true,
              alignment: Alignment.centerRight,
              items: _languages.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(
                    value,
                    style: const TextStyle(color: Colors.white, fontSize: 16),
                  ),
                );
              }).toList(),
              selectedItemBuilder: (BuildContext context) {
                return _languages.map<Widget>((String item) {
                  return Align(
                    alignment: Alignment.centerRight,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: Text(
                        item,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  );
                }).toList();
              },
              onChanged: _isTranslating
                  ? null
                  : (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          _selectedLanguage = newValue;
                          _translatedSections.clear();
                        });
                      }
                    },
            ),
          ),
        ],
      ),
      body: _isTranslating
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                // Main title card
                Card(
                  elevation: 3,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Text(
                      widget.lesson.title,
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.indigo[900],
                          ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                if (_translationError != null) ...[
                  Card(
                    color: Colors.red[50],
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        _translationError!,
                        style: const TextStyle(color: Colors.red, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                // Sections
                _buildTranslatableSection(
                  title: 'Body / Topic Summary',
                  content: widget.lesson.body ?? 'Not available',
                ),

                _buildTranslatableListSection(
                  title: 'Learning Objectives',
                  items: widget.lesson.learningObjectives,
                ),

                _buildTranslatableListSection(
                  title: 'Key Concepts',
                  items: widget.lesson.keyConcepts,
                ),

                _buildTranslatableSection(
                  title: 'Simple Explanation',
                  content: widget.lesson.simpleExplanation ?? 'Not available',
                ),

                _buildTranslatableListSection(
                  title: 'Activities',
                  items: widget.lesson.activities,
                ),

                _buildTranslatableSection(
                  title: "Teacher's Notes",
                  content: widget.lesson.teachersNote ?? 'Not available',
                ),

                const SizedBox(height: 80), // space for potential FAB
              ],
            ),
    );
  }

  Widget _buildTranslatableSection({
    required String title,
    required String content,
  }) {
    if (content.trim().isEmpty || content == 'Not available') return const SizedBox.shrink();

    final translated = _translatedSections[title];

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                if (_selectedLanguage != 'English')
                  IconButton(
                    icon: const Icon(Icons.translate, color: Colors.indigo),
                    tooltip: 'Translate to $_selectedLanguage',
                    onPressed: () => _translateSection(title, content),
                  ),
              ],
            ),
            const SizedBox(height: 16),

            // Original content
            SelectableText(
              content,
              style: const TextStyle(fontSize: 16, height: 1.6),
            ),

            // Translated content (if available)
            if (translated != null) ...[
              const Divider(height: 32, thickness: 1),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: SelectableText(
                  translated,
                  style: TextStyle(fontSize: 16, height: 1.6, color: Colors.blue[900]),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTranslatableListSection({
    required String title,
    List<String>? items,
  }) {
    if (items == null || items.isEmpty) return const SizedBox.shrink();

    final translated = _translatedSections[title];

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                if (_selectedLanguage != 'English')
                  IconButton(
                    icon: const Icon(Icons.translate, color: Colors.indigo),
                    tooltip: 'Translate to $_selectedLanguage',
                    onPressed: () {
                      final original = items.join('\n');
                      _translateSection(title, original);
                    },
                  ),
              ],
            ),
            const SizedBox(height: 16),

            // Original list
            ...items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.circle, size: 10, color: Colors.indigo),
                      const SizedBox(width: 12),
                      Expanded(child: SelectableText(item, style: const TextStyle(fontSize: 16))),
                    ],
                  ),
                )),

            // Translated version
            if (translated != null) ...[
              const Divider(height: 32, thickness: 1),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue[200]!),
                ),
                child: SelectableText(
                  translated,
                  style: TextStyle(fontSize: 16, height: 1.6, color: Colors.blue[900]),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}