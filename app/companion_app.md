## Companion App — UI/UX Design Description

### Role of the app

The Companion App is the **control center and memory layer** for AnimeDoll. It pairs over Bluetooth, offloads heavy work to the phone and cloud, and turns raw captures into **characterful moments** users can revisit and share. The experience should feel like **opening a private scrapbook with a friend**, not like a generic IoT utility.

### Visual language

- **Anime-inspired, friendly, collectible**: Visual tone matches the physical doll—warm, expressive, and clearly “for fans,” not corporate productivity software.
- **Flat UI**: Clear hierarchy, simple surfaces, and readable typography so dense content (photos, captions, settings) stays scannable on the move.
- **Scrapbook / journal (手账) aesthetic**: Soft dividers, card-like entries, and a sense of **pages and memories** rather than sterile lists. This reinforces the product line: *“not just decoration—a travel companion with memory.”*

### Information architecture — three pillars

**1. Soul Injection Room (persona configuration)**  
Purpose: **Define who the doll “is”** in voice and behavior.

- Users set a **nickname** and a **personality prompt** (e.g. sharp-tongued but tsundere magical girl) so replies match a chosen archetype.
- **Voice selection** maps abstract “character” to audible identity (ties to future premium voice packs).
- UX goal: **playful setup**, low friction, with clear preview of how prompts affect tone—users should feel they are “injecting a soul,” not filling a database.

**2. Space-Time Album (memory feed)**  
Purpose: **Relive the day from the doll’s perspective.**

- A **first-person photo stream** from the device’s camera path, paired with **AI-generated inner monologue** (“inner OS”) for each moment or burst.
- This is the digital twin of the evening storyboard: opening the app after a con and seeing an auto-built **“con diary”** to read and share.
- UX goal: **emotional browsing**—quick scan of highlights, tap-in for detail, and a narrative voice consistent with the configured persona.

**3. Energy Station (device health)**  
Purpose: **Trust and maintenance** for a battery-powered BLE accessory.

- **Battery level**, **Bluetooth connection state**, and **firmware update** entry points in one place.
- UX goal: **reassurance at a glance**—users know whether the doll is “awake” and safe to take out; technical actions stay calm and non-alarming.

### Cross-cutting UX principles

- **Phone as compute hub**: The app should communicate that **capture is lightweight on-device**, while understanding and diary generation may involve network activity—without breaking the fantasy with raw technical jargon in primary flows.
- **Privacy and social context**: Because the hardware uses a camera in public settings, the app’s copy and structure should support **transparent, user-controlled memory** (what gets saved, what is shared) in line with the product’s need to address privacy sensitivities.
- **Monetization without clutter**: Personality packs and advanced voices are natural extensions of **Soul Injection** and voice pickers; the base experience stays complete and readable.

### Summary

The Companion App’s UI/UX is designed as a **flat, anime-flavored, journal-style companion** to the physical doll: **configure identity** (Soul Injection), **browse shared memories** (Space-Time Album), and **monitor the link to the physical device** (Energy Station)—so the product reads as **“a cross-dimensional AI companion with memory,”** not a generic smart-gadget dashboard.