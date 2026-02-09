import 'package:flutter/material.dart';
<<<<<<< HEAD
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
=======
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:thutohub/screens/home_screen.dart';
import 'package:thutohub/services/supabase_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  bool envLoaded = false;

  try {
    // Explicit path – match pubspec exactly (no leading ./ or anything)
    await dotenv.load(fileName: 'assets/config.env');
    print('✅ .env (config.env) loaded successfully');
    print('Loaded keys: ${dotenv.env.keys.toList()}'); // Debug: see what actually loaded
    envLoaded = true;
  } catch (e) {
    print('❌ Failed to load config.env: $e');
    // App can continue with fallbacks instead of crashing
  }

  // Never use ! here – use ?? to avoid NotInitializedError / crash
  final geminiKey = envLoaded
      ? (dotenv.env['GEMINI_API_KEY'] ?? 'fallback-gemini-key-for-hackathon')
      : 'fallback-gemini-key-for-hackathon';

  final supabaseUrl = envLoaded
      ? (dotenv.env['SUPABASE_URL'] ?? '')
      : '';

  final supabaseAnonKey = envLoaded
      ? (dotenv.env['SUPABASE_ANON_KEY'] ?? '')
      : '';

  if (supabaseUrl.isNotEmpty && supabaseAnonKey.isNotEmpty) {
    SupabaseServiceWrapper.initialize(supabaseUrl, supabaseAnonKey);
  } else {
    print('Warning: Supabase keys missing – skipping init (using mock/fallback mode?)');
  }

  runApp(MyApp(geminiKey: geminiKey));
}

class MyApp extends StatelessWidget {
  final String geminiKey;

  const MyApp({super.key, required this.geminiKey});
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
<<<<<<< HEAD
      title: 'Lessons App MVP with Gemini 3',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      home: const HomeScreen(),
=======
      debugShowCheckedModeBanner: false,
      title: 'ThutoHub Grade 4 Maths',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomeScreen(geminiKey: geminiKey),
>>>>>>> d0a41dcf8f6b0487a27d12e9528400beec2b0d67
    );
  }
}