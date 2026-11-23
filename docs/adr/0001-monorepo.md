# One repo for the platform and all courses

We keep the shared platform, the master site and every course in one repo, using npm workspaces.

The platform will change often while it is being pulled out of the Textual Criticism site and while Logos is built on it. With separate repos, every platform fix would need a tagged release and an update in each course. In one repo a change is made once and checked against every course in the same build. One maintainer does the editing, with Claude, so per-course access rights are not needed.

GitHub Pages gives one site per repo, so the repo publishes one site: the master page at the root and each course under its own path (`/logos/`). That site is the master site.

We would revisit this if a course needs its own team with its own access rights, or once the platform rarely changes. A course can be split out with its history if that happens.
