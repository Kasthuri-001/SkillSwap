import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, FolderTree, Smartphone } from 'lucide-react';

const FLUTTER_FILES = [
  {
    path: 'lib/main.dart',
    title: 'main.dart (App Entry Point)',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/skill_provider.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => SkillProvider()),
      ],
      child: const SkillSwapApp(),
    ),
  );
}

class SkillSwapApp extends StatelessWidget {
  const SkillSwapApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkillSwap',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6366F1),
          brightness: Brightness.dark,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}`
  },
  {
    path: 'lib/models/skill_model.dart',
    title: 'skill_model.dart (Skill Schema)',
    code: `class SkillListing {
  final String id;
  final String userId;
  final String userName;
  final String userAvatar;
  final String userCollege;
  final double userRating;
  final String title;
  final String category;
  final String description;
  final String level;
  final List<String> tags;
  final int pointsCost;

  SkillListing({
    required this.id,
    required this.userId,
    required this.userName,
    required this.userAvatar,
    required this.userCollege,
    required this.userRating,
    required this.title,
    required this.category,
    required this.description,
    required this.level,
    required this.tags,
    required this.pointsCost,
  });

  factory SkillListing.fromJson(Map<String, dynamic> json) {
    return SkillListing(
      id: json['id'],
      userId: json['userId'],
      userName: json['userName'],
      userAvatar: json['userAvatar'],
      userCollege: json['userCollege'],
      userRating: (json['userRating'] as num).toDouble(),
      title: json['title'],
      category: json['category'],
      description: json['description'],
      level: json['level'],
      tags: List<String>.from(json['tags'] ?? []),
      pointsCost: json['pointsCost'] ?? 30,
    );
  }
}`
  },
  {
    path: 'lib/services/api_service.dart',
    title: 'api_service.dart (REST & WebSockets)',
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/skill_model.dart';

class ApiService {
  static const String baseUrl = 'https://skillswap.app/api';
  static const String wsUrl = 'wss://skillswap.app/ws';

  static Future<List<SkillListing>> fetchSkills() async {
    final response = await http.get(Uri.parse('$baseUrl/skills'));
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final List list = data['skills'];
      return list.map((json) => SkillListing.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load skills');
    }
  }

  static WebSocketChannel connectWebSocket(String userId) {
    final channel = WebSocketChannel.connect(Uri.parse(wsUrl));
    channel.sink.add(json.encode({'type': 'auth', 'userId': userId}));
    return channel;
  }
}`
  },
  {
    path: 'lib/screens/home_screen.dart',
    title: 'home_screen.dart (Flutter UI Material 3)',
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/skill_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final skillProvider = Provider.of<SkillProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SkillSwap Campus'),
        actions: [
          IconButton(
            icon: const Icon(Icons.stars, color: Colors.amber),
            onPressed: () {},
          ),
        ],
      ),
      body: skillProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: skillProvider.skills.length,
              itemBuilder: (context, index) {
                final skill = skillProvider.skills[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(skill.userAvatar),
                    ),
                    title: Text(skill.title),
                    subtitle: Text('\${skill.userName} • \${skill.userCollege}'),
                    trailing: Chip(
                      label: Text('\${skill.pointsCost} PTS'),
                      backgroundColor: Colors.amber.withOpacity(0.2),
                    ),
                  ),
                );
              },
            ),
    );
  }
}`
  }
];

export const FlutterCodeViewer: React.FC = () => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedFile = FLUTTER_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 pb-12 bg-slate-950 min-h-full text-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Smartphone className="w-5 h-5" />
          <h2 className="font-bold text-sm text-white">Flutter Source Code Inspector</h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          SkillSwap is architected as a cross-platform Flutter frontend paired with a Node.js + Express REST API & WebSocket backend.
        </p>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {FLUTTER_FILES.map((f, idx) => (
          <button
            key={f.path}
            onClick={() => setSelectedFileIdx(idx)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition whitespace-nowrap ${
              selectedFileIdx === idx
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{f.path.split('/').pop()}</span>
          </button>
        ))}
      </div>

      {/* Code Window Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-indigo-300 font-semibold">{selectedFile.path}</span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Dart Code'}</span>
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{selectedFile.code}</code>
        </pre>
      </div>
    </div>
  );
};
