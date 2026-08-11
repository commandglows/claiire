#!/usr/bin/env python3
"""
schedule_content.py — Distribue progressivement les articles claiire.

Usage:
  python3 scripts/schedule_content.py --status
  python3 scripts/schedule_content.py --cadence 5 --start 2026-03-15 --dry-run
  python3 scripts/schedule_content.py --cadence 5 --start 2026-03-15

Note: claiire utilise une architecture Astro et des layouts propriétaires.
  - draft: true  → masqué de la nav + noindex (pas indexé par Google)
  - draft: false → visible dans la nav et indexé
  Le scheduling ici = marquer tous les docs comme draft:true avec une pubDate cible.
  La validation manuelle = changer draft:false article par article avant déploiement.

Options:
  --cadence N     Articles par semaine (défaut: 5)
  --start DATE    Date de début YYYY-MM-DD (défaut: demain)
  --dry-run       Affiche le plan sans modifier les fichiers
  --status        Affiche les stats actuelles
"""

import argparse
import re
from datetime import date, timedelta
from pathlib import Path

DOCS_DIR = Path(__file__).parent.parent / "src" / "content" / "docs"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cadence", type=int, default=5)
    parser.add_argument("--start", type=str, default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--status", action="store_true")
    return parser.parse_args()


def get_all_docs():
    docs = []
    for md_file in sorted(DOCS_DIR.rglob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        draft_match = re.search(r"draft:\s*(true|false)", content)
        pub_match = re.search(r"pubDate:\s*['\"]?(\d{4}-\d{2}-\d{2})['\"]?", content)
        title_match = re.search(r"title:\s*['\"]?(.+?)['\"]?\s*\n", content)

        docs.append({
            "file": md_file,
            "title": (title_match.group(1).strip() if title_match else md_file.stem),
            "draft": draft_match.group(1) == "true" if draft_match else None,
            "pub_date": pub_match.group(1) if pub_match else None,
            "relative": md_file.relative_to(DOCS_DIR),
        })
    return docs


def show_status(docs):
    today = date.today()
    no_draft = [d for d in docs if d["draft"] is None]
    drafts = [d for d in docs if d["draft"] is True]
    published = [d for d in docs if d["draft"] is False]
    scheduled = [d for d in docs if d["pub_date"] and d["draft"] is True
                 and date.fromisoformat(d["pub_date"]) > today]

    print(f"\n📊 claiire — État du contenu ({len(docs)} pages)\n")
    print(f"  ✅ Publiés (draft: false)           : {len(published)}")
    print(f"  📝 Drafts (masqués + noindex)       : {len(drafts)}")
    print(f"     dont avec pubDate future         : {len(scheduled)}")
    print(f"  ⚠️  Sans champ draft (à planifier)  : {len(no_draft)}")


def schedule_docs(docs, start_date: date, cadence: int, dry_run: bool):
    # Articles à planifier = ceux sans draft field, ou draft=True sans pubDate
    to_schedule = [d for d in docs if d["draft"] is None]

    print(f"\n📅 Planification de {len(to_schedule)} pages")
    print(f"   Cadence : {cadence}/semaine | Début : {start_date}")
    weeks = len(to_schedule) / cadence
    print(f"   Durée estimée : ~{weeks:.0f} semaines (~{weeks/4:.0f} mois)\n")

    if dry_run:
        print("🔍 DRY RUN — aucun fichier modifié\n")

    publish_days = generate_publish_days(start_date, len(to_schedule), cadence)

    modified = 0
    for doc, pub_date in zip(to_schedule, publish_days):
        new_date_str = pub_date.isoformat()

        if dry_run:
            print(f"  {new_date_str} — {str(doc['relative'])[:60]}")
            continue

        content = doc["file"].read_text(encoding="utf-8")

        # Ajouter/remplacer pubDate dans le frontmatter
        if "pubDate:" in content:
            content = re.sub(
                r"pubDate:\s*['\"]?\S+['\"]?",
                f"pubDate: '{new_date_str}'",
                content,
            )
        else:
            # Ajouter après title:
            content = re.sub(
                r"(title:[^\n]+\n)",
                f"\\1pubDate: '{new_date_str}'\n",
                content,
                count=1,
            )

        # Ajouter draft: true si pas présent
        if "draft:" not in content:
            content = re.sub(
                r"(title:[^\n]+\n)",
                "\\1draft: true\n",
                content,
                count=1,
            )
        else:
            content = re.sub(r"draft:\s*(true|false)", "draft: true", content)

        doc["file"].write_text(content, encoding="utf-8")
        modified += 1

    if not dry_run:
        print(f"✅ {modified} pages mises à jour (draft: true + pubDate cible)")
        print("\n💡 Prochaine étape : révise chaque page et change 'draft: true' → 'draft: false' pour la valider.")
        print("   Chaque déploiement publie les articles validés.")


def generate_publish_days(start: date, count: int, per_week: int) -> list[date]:
    per_week = max(1, min(per_week, 7))
    interval = 7 / per_week
    days = []
    slot = 0
    while len(days) < count:
        pub_date = start + timedelta(days=round(slot * interval))
        if not days or pub_date > days[-1]:
            days.append(pub_date)
        slot += 1
    return days[:count]


def main():
    args = parse_args()
    docs = get_all_docs()

    if args.status:
        show_status(docs)
        return

    show_status(docs)

    start_date = date.today() + timedelta(days=1)
    if args.start:
        start_date = date.fromisoformat(args.start)

    schedule_docs(docs, start_date, args.cadence, args.dry_run)


if __name__ == "__main__":
    main()
