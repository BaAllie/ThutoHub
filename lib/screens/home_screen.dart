import 'package:flutter/material.dart';

import 'lessons_list_screen.dart';  // Import the list screen

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
          ),
        ),
      ),
    );
  }
}