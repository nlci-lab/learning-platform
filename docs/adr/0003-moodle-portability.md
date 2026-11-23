# Keep a path into Moodle open

We may later move the courses into Moodle, so that teacher and student activity can be recorded and quizzes and exams graded. The static sites should be able to move there by export rather than by rebuild.

What this means now:

- Content is data with stable ids (ADR 0002).
- The question schema stays within question types Moodle can import: multiple choice, true/false, short answer, matching and essay.
- Pages are self-contained: relative links through `url()`, no dependence on other sites to work, and readable without JavaScript. Pages built this way can be packaged as SCORM.

What comes later, when the LMS decision is made:

- Exporters in the platform: a SCORM package per module, and a Moodle XML (or GIFT) question bank per course.
- A test import into a Moodle test site.

To check before the exporters are built: Moodle's current import formats and SCORM version support. They were taken from general knowledge, not yet verified.
