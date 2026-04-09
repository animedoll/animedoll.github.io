---
name: Enrich Presentation Content
overview: Improve and enrich the AnimeDoll presentation markdown plan with deeper content, market data, competitive analysis, and richer storytelling, then update the HTML web PPT to match the enriched content -- adding new slides and enhancing existing ones.
todos:
  - id: enrich-markdown
    content: Rewrite and enrich docs/presentation_slides.md with all content improvements, new slides, market data, second persona, competitive analysis, expanded BMC, 4th storyboard scene, community slide, and 3-phase roadmap
    status: completed
  - id: add-new-html-slides
    content: "Add 2 new HTML slides: Competitive Landscape (after SWOT) and Community & Data Flywheel (before conclusion)"
    status: in_progress
  - id: update-existing-slides
    content: "Update content of existing HTML slides to match enriched markdown: 5W1H market data, SWOT multi-bullet, 2nd persona, 3rd pain conversion, expanded BMC, 4th storyboard, hardware specs"
    status: pending
  - id: fix-indices-and-nav
    content: Fix all data-index values, TOC onclick targets, totalSlides counter, CSS index selectors, and nav dot count for new 19-slide structure
    status: pending
  - id: add-css-for-new-slides
    content: Add CSS styles for new competitive grid, positioning callout, and community flywheel components
    status: in_progress
  - id: verify-and-polish
    content: Verify slide navigation, check lints, test slide counter and progress bar accuracy
    status: pending
isProject: false
---

# Enrich AnimeDoll Presentation Content and Web PPT

## Phase 1: Enrich Markdown Content ([docs/presentation_slides.md](docs/presentation_slides.md))

### New Slides to Add (2 new slides, total: 18 slides)

- **New Slide 5: Competitive Landscape** (inserted after current Slide 4 SWOT)
  - Compare AnimeDoll against 4 competitors across key dimensions:
    - Traditional plush/gacha toys (Jellycat, Sonny Angel) -- no intelligence
    - AI wearables (Humane AI Pin, Rabbit R1) -- no emotional design
    - Smart toys (Anki Vector, Tamagotchi) -- not wearable, not ACG-focused
    - Virtual companions (Character.AI, Replika) -- no physical presence
  - Show a clear positioning matrix: "emotional warmth" vs "AI capability"
  - Conclude: AnimeDoll uniquely occupies the "high warmth + high AI" quadrant

- **New Slide 17: User Community & Data Flywheel** (before final conclusion)
  - UGC ecosystem: users share AI-generated travel journals on social platforms
  - Data flywheel: more usage -> richer personality models -> better companionship
  - Community features: AnimeDoll meetups, "my doll's diary" sharing

### Content Enrichments on Existing Slides

**Slide 3 (Background & 5W1H):**
- Add specific market data: China's ACG peripheral market reached 130B+ RMB in 2025, "itabag" hashtag on Xiaohongshu surpassed 500M views
- Add companion economy data: emotional consumption grew 35%+ YoY among Gen-Z
- Sharpen the 5W1H descriptions with more concrete detail

**Slide 4 (SWOT):**
- Add industry data: trendy toy market CAGR 25%+, AI hardware penetration in consumer space growing
- Strengthen each SWOT cell with 2-3 bullet points instead of single sentences
- Add "AI-native generation" as an opportunity

**Slide 5 (User Research):** (now becomes Slide 6 after insertion)
- Add a second persona: "小B, 23岁, 社畜, 二次元轻度用户" -- broadens appeal beyond hardcore fans
- Add a third interview quote about social interaction
- Add quantitative survey data (hypothetical): "78% of itabag owners wish their accessories could interact"

**Slide 6 (Needs & Opportunities):** (now becomes Slide 7)
- Add a third pain-to-need conversion: "孤独社交 -> 社交破冰: 公仔作为话题入口"
- Strengthen the opportunity box with a supporting data point

**Slide 8 (BMC):** (now becomes Slide 9)
- Add missing BMC cells: **Cost Structure** (hardware BOM, cloud API, IP licensing) and **Customer Relationships** (community-driven, fan-operated)
- Add **Key Activities**: hardware R&D, AI model fine-tuning, IP negotiation

**Slide 11 (Storyboard):** (now becomes Slide 12)
- Add a 4th scenario: "Weekend meetup" -- two AnimeDoll users meet, their dolls recognize each other and have a dialogue

**Slide 12-14 (CMF/Hardware):** (now Slide 13-15)
- Add estimated battery life: ~4-6 hours active use
- Add BLE range spec: ~10m effective range
- Add IP67-level dust resistance mention

**Slide 16 (Conclusion):** (now Slide 18)
- Expand to 3-phase roadmap:
  - Phase 1: Original character validation
  - Phase 2: IP collaborations
  - Phase 3: Open platform -- let users create custom "soul packs" via fine-tuned LLM
- Update the closing vision quote

### Updated Structure (18 slides)

```
1.  Cover
2.  TOC (updated to reflect 5 sections)
3.  Background & 5W1H (enriched)
4.  SWOT (enriched)
5.  Competitive Landscape (NEW)
6.  User Research (enriched, 2 personas)
7.  Needs & Opportunities (enriched, 3 conversions)
8.  Concept & Product Definition
9.  Business Model Canvas (enriched, 8 cells)
10. Core Features
11. System Architecture
12. Storyboard (enriched, 4 scenes)
13. CMF White-BG & Materials
14. Three-View & Camera
15. Hardware Exploded View (enriched specs)
16. Companion App UI
17. Scene Renders
18. Community & Data Flywheel (NEW)
19. Conclusion & Roadmap (enriched, 3 phases)
```

Wait, that's 19. Let me recalculate -- actually keep current 17 slides mapping:
- Insert 1 new competitive slide (after SWOT)
- Insert 1 new community slide (before conclusion)
- Total: 19 slides (data-index 0-18)

---

## Phase 2: Update HTML Web PPT ([index.html](index.html))

### Structural Changes
- Add **Slide 5** (data-index="4" shifted): Competitive Landscape with a positioning matrix grid (4 competitor cards + a central positioning highlight)
- Add **Slide 18** (data-index="17"): Community & Data Flywheel with 3 feature cards
- Shift all subsequent `data-index` values by +1 after each insertion
- Update `totalSlides` from 17 to 19
- Update TOC `onclick` targets to match new slide indices
- Update CSS slide-index-specific selectors (e.g., `slide[data-index="7"]`, `slide[data-index="9"]`, etc.)

### Content Updates per Slide
- **Slide 3 (5W1H)**: Add market data callout card above the 5W1H grid
- **Slide 4 (SWOT)**: Expand each SWOT cell text to multi-bullet
- **New Slide 5 (Competitive)**: New HTML block with 4 competitor cards + positioning callout
- **Slide 6 (User Research)**: Add second persona card + third quote block
- **Slide 7 (Needs)**: Add third pain-flow conversion row
- **Slide 9 (BMC)**: Add 2 more `bmc-cell` divs for Cost Structure and Customer Relationships
- **Slide 12 (Storyboard)**: Add 4th `story-item` for meetup scenario
- **Slide 15 (Hardware)**: Add battery life and BLE range to stats row
- **New Slide 18 (Community)**: New HTML block with community feature cards
- **Slide 19 (Conclusion)**: Expand roadmap to 3 phases, add Phase 3 card

### CSS Additions
- Add `.competitor-grid` styles for the new competitive landscape slide
- Add `.positioning-callout` styles for the positioning highlight
- Add `.flywheel-flow` styles for the data flywheel visualization
- Update `data-index` selectors for shifted slides
