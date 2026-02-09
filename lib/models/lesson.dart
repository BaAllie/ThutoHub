class Lesson {
  final int id;
  final String title;
  final String? description;
  final String? body;
  final List<String>? learningObjectives;
  final List<String>? keyConcepts;
  final String? simpleExplanation;
  final List<String>? activities;
  final String? teachersNote;
  final String? quiz;  // ← NEW: stores AI-generated quiz

  Lesson({
    required this.id,
    required this.title,
    this.description,
    this.body,
    this.learningObjectives,
    this.keyConcepts,
    this.simpleExplanation,
    this.activities,
    this.teachersNote,
    this.quiz,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: _parseId(json['id']),
      title: json['title'] as String,
      description: json['description'] as String?,
      body: json['body'] as String?,
      learningObjectives: _parseStringList(json['learning_objectives']),
      keyConcepts: _parseStringList(json['key_concepts']),
      simpleExplanation: json['simple_explanation'] as String?,
      activities: _parseStringList(json['activities']),
      teachersNote: json['teachers_note'] as String?,
      quiz: json['quiz'] as String?,  // ← added
    );
  }

  static int _parseId(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    return int.tryParse(value.toString()) ?? 0;
  }

  static List<String>? _parseStringList(dynamic value) {
    if (value == null) return null;
    if (value is String) return [value.trim()];
    if (value is List) {
      return value.map((e) => e?.toString().trim() ?? '').where((s) => s.isNotEmpty).toList();
    }
    return null;
  }

  // Optional: Display helpers
  String get learningObjectivesDisplay =>
      learningObjectives?.map((e) => '• $e').join('\n') ?? '';

  String get keyConceptsDisplay =>
      keyConcepts?.map((e) => '• $e').join('\n') ?? '';

  String get activitiesDisplay =>
      activities?.map((e) => '- $e').join('\n') ?? '';
}