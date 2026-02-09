import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

import 'screens/home_screen.dart';

// Global GenerativeModel instance (Gemini 3 family)
final generativeModel = GenerativeModel(
  model: 'gemini-3.0-flash',  // or 'gemini-3.0-pro' if you have access
  apiKey: 'AIzaSyCtjx_9y-NE69xA_dH-W3mPStDCbOu1lcE',  // your key
);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase
  await Supabase.initialize(
    url: 'https://ssdghlrjigajxspymvpw.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZGdobHJqaWdhanhzcHltdnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjY3MjQsImV4cCI6MjA4NTY0MjcyNH0.VzESJKAR8XEo__s-2Go68KgrIqjHz0DA3K7pmIWKXfY',
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Lessons App MVP with Gemini 3',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      home: const HomeScreen(),
    );
  }
}