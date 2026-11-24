# Unverified facts are stored and shown separately

A fact goes into a profile's main fields only when a named, checkable source supports it. Anything else (from memory, Wikipedia, unsourced sigla lists) is recorded in a separate `unverified` list with where it came from, and shown on the page in its own clearly labelled box. We never fill a gap with a plausible guess. A second, independent flag records whether the witness has been checked against the printed UBS5 list, because no copy of that list was available when the data was seeded.

## Amendment (2026-11-25): key-figure profiles

For the key-figure profiles (`src/content/people/`), Wikipedia may serve as an interim source in the main fields, on two conditions: the source is listed with `checked: false`, and every fact that rests only on it shows a visible "to check" tag on the page. A fact with no source at all is also tagged. As each fact is checked against a published source (for example Metzger and Ehrman, *The Text of the New Testament*, 4th ed., or Aland and Aland), the Wikipedia source is replaced and the tag disappears. Witness profiles keep the original rule above.

Why: the people pages describe editions and dates, not manuscript evidence, and an empty profile would teach less than a tagged one. The tag keeps the reader from mistaking an unchecked fact for a checked one.
