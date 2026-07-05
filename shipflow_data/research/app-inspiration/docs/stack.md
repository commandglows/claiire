# Stack TMV App — Décision finale

## Stack retenu

| Couche       | Tech                              |
|--------------|-----------------------------------|
| Frontend     | React Native (Expo) + TypeScript  |
| Navigation   | Expo Router (file-based)          |
| Companion    | Rive (state machines)             |
| UI Anims     | Reanimated                        |
| Backend/DB   | Convex                            |
| Auth         | Clerk                             |
| IA (LLM)     | llama.cpp on-device (Gemma 2B / Llama 3.2 3B) — gratuit |
| Voix STT     | Native iOS/Android — gratuit      |
| Voix TTS     | Native iOS/Android — gratuit      |
| Paiements    | RevenueCat (mobile) + Polar (web) |

---

## Principes clés

**Coût par MAU : ~€0**
- LLM tourne sur le device (llama.cpp, GGUF) — zéro API
- STT/TTS natif (iOS Speech Framework / Android SpeechRecognizer) — zéro API
- Seul Convex est payant, et très généreux en free tier

**Pourquoi Rive (et pas React Three Fiber)**
- Gratuit, éditeur web moderne, export `.riv` direct
- State machines pour transitions émotionnelles du companion
- Intégration RN via `rive-react-native` (package officiel)
- Pas de bridge GPU complexe — performances prévisibles

**Architecture : Local Body, Local Brain**
```
Voix utilisateur
      ↓
  STT natif (on-device, gratuit)
      ↓
  llama.cpp (on-device, Gemma 2B / Llama 3.2 3B)
      ↓
  TTS natif (on-device, gratuit)
      ↓
  Rive animation (state machine triggered)
```

- Tout tourne sur le device → 0 latence réseau, 0 coût API
- Convex = uniquement pour la persistance et la sync cross-device
- Convex Vector Search = mémoire long-terme du companion (RAG)

## Paiements

- **RevenueCat** : in-app purchases iOS/Android (obligatoire pour les stores)
- **Polar** : paiements web (dashboard, Phase 3)

## Notes on-device LLM

- Modèle recommandé MVP : Gemma 2B (GGUF, ~1.5GB) ou Llama 3.2 3B (~2GB)
- Intégration via `llama.rn` (binding React Native de llama.cpp)
- Téléchargement en deux étapes : splash screen → background download
- Fallback : mode texte sans voix si modèle non encore téléchargé
